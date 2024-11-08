const express = require("express");
const morgan = require("morgan");
const database = require("./database");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const axios = require('axios');


//Configuracion inicial
const app = express();
app.set("port",4000);
app.listen(app.get("port"));
console.log("Escuchando comunicaciones al puerto",app.get("port"));

//Middlewares
app.use(morgan("dev"));
// Middleware para analizar el cuerpo de las solicitudes en formato JSON
app.use(express.json());
app.use(cors());

// Middleware para verificar el token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Obtener el token

    if (!token) {
        return res.status(401).json({ message: "No se proporcionó token." });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token no válido." });
        }
        req.user = user; // Almacena la información del usuario en la solicitud
        next(); // Continua con la siguiente función de middleware
    });
}


const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Obtener el token

    if (!token) {
        return res.sendStatus(403); // Sin token
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token inválido." }); // Token no válido
        }
        // Almacenar la información del usuario en la solicitud
        req.user = user; 
        next(); // Continuar a la siguiente función middleware
    });
};

// Middleware para verificar el rol de administrador
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        console.log("Acceso denegado: No tienes permisos para realizar esta acción."); // Imprimir en consola
        return res.status(403).json({ message: "No tienes permisos para realizar esta acción." });
    }
    next(); // Continuar a la siguiente función middleware
};

app.get("/",(req,res)=>{
    res.send("Bienvenido a mi primera API con Node js");
})



/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.get("/peliculas", async (req, res) => {
    try {
        const connection = await database.getConnection();
        
        // Consulta para obtener películas, sus plataformas y salas disponibles
        const query = `
            SELECT 
                p.id_pelicula,
                p.titulo,
                p.genero,
                p.año,
                p.sinopsis,
                p.duracion,
                GROUP_CONCAT(DISTINCT po.nombre SEPARATOR ', ') AS plataformas,
                GROUP_CONCAT(DISTINCT s.nombre SEPARATOR ', ') AS salas
            FROM 
                Pelicula p
            LEFT JOIN 
                Listado_Disponible_Por_Plataforma l ON p.id_pelicula = l.id_pelicula
            LEFT JOIN 
                Plataforma_Online po ON l.id_plataforma_online = po.id_plataforma_online
            LEFT JOIN 
                listado_disponible_por_sala d ON p.id_pelicula = d.id_pelicula
            LEFT JOIN 
                Sala_De_Cine s ON d.id_sala_de_cine = s.id_sala_de_cine
            GROUP BY 
                p.id_pelicula
        `;
        
        const [result] = await connection.query(query); // Ejecuta la consulta

        res.json(result); // Devuelve el resultado
    } catch (error) {
        console.error('Error al obtener las películas:', error);
        res.status(500).json({ message: 'Error al obtener las películas.' });
    }
});

/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.get("/peliculas/nombre/:nombre", async (req, res) => {
    const { nombre } = req.params; // Obtiene el nombre de la película de la URL

    try {
        const connection = await database.getConnection();
        const [result] = await connection.query(
            "SELECT * FROM Pelicula WHERE LOWER(titulo) = LOWER(?)", [nombre] // Busca por el título de la película, ignorando mayúsculas
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "Película no encontrada" });
        }

        res.json(result[0]); // Devuelve solo la película encontrada
    } catch (err) {
        console.error("Error en la consulta:", err); // Mensaje de error detallado
        res.status(500).json({ message: "Ocurrió un error interno en el servidor al intentar obtener los datos" });
    }
});

/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.get("/peliculas/genero/:genero", async (req, res) => {
    const { genero } = req.params; // Obtiene el genero desde la URL
    try {
        // Imprime el género buscado
        console.log("Género buscado:", genero);

        const connection = await database.getConnection();
        
        // Prepara la consulta SQL
        const query = "SELECT * FROM Pelicula WHERE genero = ?";
        
        // Imprime la consulta SQL
        console.log("Consulta SQL:", query);

        const [result] = await connection.query(query, [genero]); // Ejecuta la consulta

        if (result.length === 0) {
            return res.status(404).json({ message: "No se encontraron películas para este género" });
        }

        res.json(result); // Devuelve todas las películas que coinciden con el género
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ocurrio un error interno en el servidor al realizar la búsqueda" });
    }
});

/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.post("/usuarios/:correo/favoritos", async (req, res) => {
    const correo = req.params.correo; // Obtiene el correo del usuario desde la URL
    const { id_pelicula } = req.body; // Obtiene el ID de la película desde el cuerpo de la solicitud

    try {
        const connection = await database.getConnection();

        // Busca al usuario por correo
        const [user] = await connection.query("SELECT * FROM Usuario WHERE email = ?", [correo]);
        if (user.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const userId = user[0].id_usuario; // Obtiene el ID del usuario a partir del resultado

        // Verifica si la película existe
        const [pelicula] = await connection.query("SELECT * FROM Pelicula WHERE id_pelicula = ?", [id_pelicula]);
        if (pelicula.length === 0) {
            return res.status(404).json({ message: "Película no encontrada" });
        }

        // Verifica si la película ya está en la lista de favoritos
        const [favorito] = await connection.query("SELECT * FROM Favoritos WHERE id_usuario = ? AND id_pelicula = ?", [userId, id_pelicula]);
        if (favorito.length > 0) {
            return res.status(400).json({ message: "La película ya está en la lista de favoritos" });
        }

        // Agrega la película a la lista de favoritos
        await connection.query("INSERT INTO Favoritos (id_usuario, id_pelicula) VALUES (?, ?)", [userId, id_pelicula]);

        res.status(200).json({ message: "Película agregada a favoritos" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ocurrió un error interno al agregar la película a la lista de favoritos" });
    }
});


/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.get("/usuarios/:email/favoritos", async (req, res) => {
    const emailUser = req.params.email; // Obtiene el email del usuario desde la URL

    try {
        const connection = await database.getConnection();

        // Verifica si el usuario existe
        const [user] = await connection.query("SELECT * FROM Usuario WHERE email = ?", [emailUser]);
        if (user.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Obtiene las películas favoritas del usuario junto con su disponibilidad
        const [favoritos] = await connection.query(`
            SELECT 
                P.id_pelicula, 
                P.titulo, 
                P.genero, 
                P.año, 
                P.sinopsis, 
                P.duracion, 
                GROUP_CONCAT(DISTINCT IF(D.id_sala IS NOT NULL, S.nombre, NULL) SEPARATOR ', ') AS salas,
                GROUP_CONCAT(DISTINCT IF(D.id_plataforma IS NOT NULL, PL.nombre, NULL) SEPARATOR ', ') AS plataformas
            FROM 
                Favoritos F
            JOIN 
                Pelicula P ON F.id_pelicula = P.id_pelicula
            LEFT JOIN 
                Disponibilidad D ON P.id_pelicula = D.id_pelicula
            LEFT JOIN 
                Sala_De_Cine S ON D.id_sala = S.id_sala_de_cine  -- Aquí hacemos el JOIN con la tabla de salas
            LEFT JOIN 
                Plataforma_Online PL ON D.id_plataforma = PL.id_plataforma_online -- Aquí hacemos el JOIN con la tabla de plataformas
            JOIN 
                Usuario U ON F.id_usuario = U.id_usuario
            WHERE 
                U.email = ?
            GROUP BY 
                P.id_pelicula
        `, [emailUser]);

        // Si no hay favoritos, se puede devolver un mensaje claro
        if (favoritos.length === 0) {
            return res.status(200).json({ message: "No hay películas favoritas para este usuario." });
        }

        res.status(200).json(favoritos); // Respuesta exitosa con las películas favoritas

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ocurrió un error interno al obtener las películas favoritas" });
    }
});


// Endpoint para obtener el ID del usuario basado en el correo
app.get('/usuarios/correo/:email', async (req, res) => {
    const email = req.params.email;

    try {
        // Obtener una conexión a la base de datos
        connection = await database.getConnection();
        
        // Realizar la consulta a la base de datos
        const [rows] = await connection.query('SELECT id_usuario FROM Usuario WHERE email = ?', [email]);

        if (rows.length > 0) {
            // Si se encuentra el usuario, devolver el ID
            res.status(200).json({ id_usuario: rows[0].id_usuario });
        } else {
            // Si no se encuentra el usuario, devolver un error 404
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error al obtener el ID del usuario:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});


/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.post('/usuarios', async (req, res) => {
    const { nombre, email, contrasenia, rol,plan } = req.body;

    // Asegúrate de que los datos necesarios estén presentes
    if (!nombre || !email || !contrasenia || !plan) {
        return res.status(400).json({ message: "Faltan datos requeridos." });
    }

    // Validar rol, si se proporciona
    const validRoles = ['usuario', 'admin'];
    if (rol && !validRoles.includes(rol)) {
        return res.status(400).json({ message: "Rol inválido." });
    }

    try {
        const connection = await database.getConnection();

        // Verifica si el usuario ya existe
        const [existingUser] = await connection.query(
            "SELECT * FROM Usuario WHERE email = ?",
            [email]
        );
        
        if (existingUser.length > 0) {
            return res.status(400).json({ message: "El usuario ya existe." });
        }

        // Si el rol es 'admin', verifica si ya hay un administrador
        if (rol === 'admin') {
            const [adminUser] = await connection.query("SELECT * FROM Usuario WHERE rol = 'admin'");
            if (adminUser.length > 0) {
                return res.status(400).json({ message: "Ya existe un administrador." });
            }
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(contrasenia, 10);
        
        // Inserta el nuevo usuario
        await connection.query(
            "INSERT INTO Usuario (nombre, email, contrasenia, rol,plan) VALUES (?, ?, ?, ?,?)", 
            [nombre, email, hashedPassword, rol || 'usuario',plan] // Asignar 'usuario' si no se proporciona rol
        );

        res.status(201).json({ message: "Usuario creado con éxito." });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ message: "Error al crear el usuario." });
    }
});

/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.get('/usuarios', async (req, res) => {
    try {
        const connection = await database.getConnection();

        // Ejecuta la consulta para obtener todos los usuarios
        const [users] = await connection.query("SELECT nombre, email, rol,plan FROM Usuario");

        res.status(200).json(users); // Devuelve la lista de usuarios
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        res.status(500).json({ message: "Error al obtener los usuarios." });
    }
});

/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.delete('/usuarios/email/:email', async (req, res) => {
    const email = req.params.email;
    try {
        const connection = await database.getConnection(); // Asegúrate de que 'database' esté bien definido
        const [results] = await connection.query('DELETE FROM Usuario WHERE email = ?', [email]);
        
        if (results.affectedRows > 0) {
            res.status(200).json({ message: `Usuario con email ${email} eliminado.` });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado.' });
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
});

/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.put('/usuarios/email/:email', async (req, res) => {
    const email = req.params.email;
    const { planNuevo } = req.body; // Captura el nuevo plan del cuerpo de la solicitud

    console.log('Plan nuevo recibido:', planNuevo); // Agrega esto para verificar si está definido

    try {
        const connection = await database.getConnection();
        const [results] = await connection.query('UPDATE Usuario SET plan = ? WHERE email = ?', [planNuevo, email]);

        if (results.affectedRows > 0) {
            res.status(200).json({ message: `Plan del usuario con email ${email} actualizado a ${planNuevo}.` });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado.' });
        }
    } catch (error) {
        console.error('Error al actualizar plan del usuario:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
});


/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.put("/peliculas/nombre/:nombre_pelicula", authenticateJWT, async (req, res) => {
    const { nombre_pelicula } = req.params;
    const body = req.body;

    const generosValidos = ['Acción', 'Comedia', 'Drama', 'Terror', 'Ciencia Ficción', 'Aventura', 'Documental', 'Romance'];

    try {
        const connection = await database.getConnection();

        // Verificar si la película existe
        const [existingPelicula] = await connection.query("SELECT * FROM Pelicula WHERE titulo = ?", [nombre_pelicula]);
        if (existingPelicula.length === 0) {
            return res.status(404).json({ message: "Película no encontrada." });
        }

        const updates = {};
        if (body.titulo) updates.titulo = body.titulo;
        if (body.genero) {
            if (!generosValidos.includes(body.genero)) {
                return res.status(400).json({ message: `El género debe ser uno de los siguientes: ${generosValidos.join(', ')}.` });
            }
            updates.genero = body.genero;
        }

        const setClauses = Object.keys(updates).map(key => `${key} = ?`).join(", ");
        const updateValues = Object.values(updates);
        if (updateValues.length > 0) {
            await connection.query(`UPDATE Pelicula SET ${setClauses} WHERE id_pelicula = ?`, [...updateValues, existingPelicula[0].id_pelicula]);
        }

        // Actualizar plataformas si están presentes en el cuerpo
        if (body.plataformas) {
            // Eliminar plataformas existentes para la película en la tabla de relaciones correctas
            await connection.query("DELETE FROM Listado_Disponible_Por_Plataforma WHERE id_pelicula = ?", [existingPelicula[0].id_pelicula]);
            for (const plataforma of body.plataformas) {
                await connection.query("INSERT INTO Listado_Disponible_Por_Plataforma (id_pelicula, id_plataforma_online) VALUES (?, ?)", [existingPelicula[0].id_pelicula, plataforma]);
            }
        }

        // Actualizar salas de cine si están presentes en el cuerpo
        if (body.salas_de_cine) {
            // Eliminar salas existentes para la película en la tabla de relaciones correctas
            await connection.query("DELETE FROM Listado_Disponible_Por_Sala WHERE id_pelicula = ?", [existingPelicula[0].id_pelicula]);
            for (const sala of body.salas_de_cine) {
                const idSala = parseInt(sala.trim());
                if (!isNaN(idSala) && idSala > 0) {
                    await connection.query("INSERT INTO Listado_Disponible_Por_Sala (id_pelicula, id_sala_de_cine) VALUES (?, ?)", [existingPelicula[0].id_pelicula, idSala]);
                } else {
                    console.warn(`ID de sala inválido: ${sala}`);
                }
            }
        }

        res.status(200).json({ message: "Película actualizada exitosamente." });

    } catch (error) {
        console.error("Error al actualizar la película:", error);
        res.status(500).json({ message: "Ocurrió un error interno en el servidor." });
    }
});


/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.put('/usuarios/:email/contrasenia', async (req, res) => {
    const { email } = req.params; // Obtiene el email del usuario desde la URL
    const { nueva_contrasenia } = req.body; // Obtiene la nueva contraseña desde el cuerpo de la solicitud

    // Verifica que se haya proporcionado una nueva contraseña
    if (!nueva_contrasenia) {
        return res.status(400).json({ message: "Se requiere una nueva contraseña." });
    }

    try {
        const connection = await database.getConnection();

        // Busca el usuario en la base de datos
        const [user] = await connection.query(
            "SELECT * FROM Usuario WHERE email = ?",
            [email]
        );

        if (user.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // Crea un nuevo hash para la nueva contraseña
        const newHashedPassword = await bcrypt.hash(nueva_contrasenia, 10);
        
        // Actualiza la contraseña en la base de datos
        await connection.query(
            "UPDATE Usuario SET contrasenia = ? WHERE email = ?",
            [newHashedPassword, email]
        );

        res.status(200).json({ message: "Contraseña actualizada con éxito." });
    } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        res.status(500).json({ message: "Error al actualizar la contraseña." });
    }
});


// Clave secreta para firmar los tokens
const JWT_SECRET = 'tu_clave_secreta'; // Cambia esto a una clave segura

/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.post('/usuarios/login', async (req, res) => {
    const { email, contrasenia } = req.body; // Verifica que el cuerpo de la solicitud tenga los campos correctos

    if (!email || !contrasenia) {
        return res.status(400).json({ message: "Se requiere email y contraseña." });
    }

    try {
        const connection = await database.getConnection();
        
        // Busca el usuario por email
        const [user] = await connection.query(
            "SELECT id_usuario, nombre, email, contrasenia, rol,plan FROM Usuario WHERE email = ?",
            [email]
        );
        console.log("Usuario recuperado:", user);


        // Verifica si el usuario existe
        if (user.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // Imprime las contraseñas para asegurarte de que la comparación es correcta
        console.log("Contraseña ingresada:", contrasenia);
        console.log("Contraseña almacenada (hash):", user[0].contrasenia);


        // Compara la contraseña ingresada con el hash en la base de datos
        const isPasswordValid = await bcrypt.compare(contrasenia, user[0].contrasenia);

        // Si la contraseña no es válida, retorna un mensaje de error
        if (!isPasswordValid) {
            return res.status(401).json({ message: "Credenciales inválidas." });
        }

        // Obtén el rol del usuario
        const rol = user[0].rol; 
        console.log("Rol: ", rol);

        // Genera el token incluyendo el rol
        const token = jwt.sign({ id_usuario: user[0].id_usuario, rol: rol }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token });
    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        res.status(500).json({ message: "Error al iniciar sesión." });
    }
})


/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.post("/peliculas/:id/calificar", async (req, res) => {
    const { id } = req.params;
    const { calificacion } = req.body;

    console.log("Pelicula ID a calificar:", id);
    console.log("Calificacion:", calificacion);

    // Comprobar que la calificación es válida
    if (calificacion < 1 || calificacion > 10) {
        return res.status(400).json({ message: "La calificación debe estar entre 1 y 10." });
    }

    try {
        // Verificar que la película existe
        const connection = await database.getConnection();
        const [pelicula] = await connection.query("SELECT * FROM Pelicula WHERE id_pelicula = ?", [id]);

        if (pelicula.length === 0) {
            return res.status(404).json({ message: "La película no existe." });
        }

        await connection.query(
            "INSERT INTO Calificaciones (id_pelicula, calificacion) VALUES (?, ?)",
            [id, calificacion]
        );

        res.status(200).json({ message: "Calificación registrada." });
    } catch (err) {
        console.error("Error al registrar la calificación:", err);
        res.status(500).json({ message: "Error al registrar la calificación." });
    }
});

/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.post("/peliculas/:id/comentarios", async (req, res) => {
    const { id } = req.params; // ID de la película
    const { comentario } = req.body; // Comentario enviado por el usuario

    console.log("Pelicula ID para comentario:", id);
    console.log("Comentario:", comentario);

    // Verificar que el comentario no esté vacío
    if (!comentario || comentario.trim() === "") {
        return res.status(400).json({ message: "El comentario no puede estar vacío." });
    }

    try {
        const connection = await database.getConnection();
        
        // Verificar que la película existe
        const [pelicula] = await connection.query("SELECT * FROM Pelicula WHERE id_pelicula = ?", [id]);

        if (pelicula.length === 0) {
            return res.status(404).json({ message: "La película no existe." });
        }

        // Opción 1: Almacenar el comentario sin asociar a un usuario
        await connection.query(
            "INSERT INTO Comentarios (id_pelicula, comentario) VALUES (?, ?)",
            [id, comentario]
        );

        res.status(200).json({ message: "Comentario registrado." });
    } catch (err) {
        console.error("Error al registrar el comentario:", err);
        res.status(500).json({ message: "Error al registrar el comentario." });
    }
});

/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.get("/peliculas/:id/comentarios", async (req, res) => {
    const { id } = req.params;

    try {
        const connection = await database.getConnection();
        
        // Consulta SQL sin la columna de `nombre`
        const [comentarios] = await connection.query(
            `SELECT c.id_comentario, c.comentario, c.fecha 
             FROM Comentarios c 
             WHERE c.id_pelicula = ?`,
            [id]
        );

        res.json(comentarios);
    } catch (err) {
        console.error("Error al obtener los comentarios:", err);
        res.status(500).json({ message: "Error al obtener los comentarios." });
    }
});


/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.post("/peliculas", authenticateJWT, async (req, res) => {
    let { titulo, genero, año, actores, sinopsis, duracion, plataformas = [], salas_de_cine = [] } = req.body;

    // Lista de géneros válidos
    const generosValidos = ['Accion', 'Comedia', 'Drama', 'Terror', 'Ciencia Ficcion', 'Aventura', 'Documental', 'Romance','Fantasia'];

    // Verificar que todos los campos obligatorios estén presentes
    if (!titulo || !genero || !año || !actores || !sinopsis || !duracion) {
        return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    // Convertir duracion a un número entero
    duracion = parseInt(duracion);
    if (isNaN(duracion)) {
        return res.status(400).json({ message: "La duración debe ser un número entero." });
    }

    // Validar el año
    año = parseInt(año);
    if (isNaN(año) || !Number.isInteger(año) || año < 1888 || año > new Date().getFullYear()) {
        return res.status(400).json({ message: "El año debe ser un número entero válido." });
    }

    // Validar que el género esté en la lista de géneros válidos
    // Validar que el género esté en la lista de géneros válidos
    if (!generosValidos.includes(genero)) {
        return res.status(400).json({ message: `El género debe ser uno de los siguientes: ${generosValidos.join(', ')}.` });
    }


    try {
        const connection = await database.getConnection();

        // Verificar si ya existe una película con el mismo título
        const [existingPelicula] = await connection.query("SELECT * FROM Pelicula WHERE titulo = ?", [titulo]);
        if (existingPelicula.length > 0) {
            return res.status(409).json({ message: "Ya existe una película con el mismo título." });
        }

        // Insertar la nueva película en la base de datos
        const [result] = await connection.query(
            "INSERT INTO Pelicula (titulo, genero, año, sinopsis, duracion) VALUES (?, ?, ?, ?, ?)",
            [titulo, genero, año, sinopsis, duracion]
        );

        // Después de insertar la película
        // Inserta disponibilidad en la tabla Disponibilidad
        if (plataformas && plataformas.length > 0) {
            for (const plataforma of plataformas) {
                // Aquí se asume que 'plataforma' es el ID de la plataforma existente
                await connection.query(
                    "INSERT INTO Disponibilidad (id_pelicula, id_plataforma) VALUES (?, ?)",
                    [result.insertId, plataforma] // Asegúrate que 'plataforma' es el ID correcto
                );
                // Inserta en Listado_Disponible_Por_Plataforma
                await connection.query(
                    "INSERT INTO Listado_Disponible_Por_Plataforma (id_pelicula, id_plataforma_online) VALUES (?, ?)",
                    [result.insertId, plataforma] // Asumiendo que 'plataforma' es el ID de la plataforma online
                );
            }
        }
    


    
        // Inserta actores en la tabla intermedia
        for (const actor of actores) {
            const [existingActor] = await connection.query("SELECT * FROM Actor WHERE nombre = ?", [actor]);

            let actorId;
            if (existingActor.length === 0) {
                // Si el actor no existe, insertarlo en la tabla Actor
                const [insertedActor] = await connection.query(
                    "INSERT INTO Actor (nombre) VALUES (?)",
                    [actor]
                );
                actorId = insertedActor.insertId; // Obtener el ID del nuevo actor
            } else {
                actorId = existingActor[0].id_actor; // Obtener el ID del actor existente
            }

            // Verifica si la relación ya existe antes de insertar
            const [existingRelation] = await connection.query(
                "SELECT * FROM Pelicula_Actores WHERE pelicula_id = ? AND actor_id = ?",
                [result.insertId, actorId]
            );

            if (existingRelation.length === 0) {
                // Inserta en la tabla intermedia solo si no existe
                await connection.query(
                    "INSERT INTO Pelicula_Actores (pelicula_id, actor_id) VALUES (?, ?)",
                    [result.insertId, actorId]
                );
            }
        }

        // Inserta salas de cine si existen
        // Inserta salas de cine si existen y son válidas
        if (salas_de_cine && salas_de_cine.length > 0) {
            for (const sala of salas_de_cine) {
                const idSala = parseInt(sala.trim());
                if (!isNaN(idSala) && idSala > 0) {
                    await connection.query(
                        "INSERT INTO Disponibilidad (id_pelicula, id_sala) VALUES (?, ?)",
                        [result.insertId, idSala]
                    );
                    // Inserta en listado_disponible_por_sala
                    await connection.query(
                    "INSERT INTO listado_disponible_por_sala (id_pelicula, id_sala_de_cine) VALUES (?, ?)",
                    [result.insertId, idSala] // Asumiendo que 'plataforma' es el ID de la plataforma online
                    );
                } else {
                    console.warn(`ID de sala inválido: ${sala}`); // Advertencia para IDs inválidos
 // Advertencia para IDs inválidos
                }
            }
        } else {
            console.log("No se proporcionaron salas de cine para insertar.");
        }


        // Devolver la respuesta exitosa
        res.status(200).json({
            id: result.insertId,
            titulo,
            genero,
            año,
            actores,
            sinopsis,
            duracion,
            plataformas,
            salas_de_cine
        });

    } catch (error) {
        console.error("Error al agregar la película:", error);
        res.status(500).json({ message: "Ocurrió un error interno en el servidor." });
    }
});


/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.delete("/peliculas/nombre/:nombre_pelicula", authenticateJWT, async (req, res) => {
    const nombre_pelicula = req.params.nombre_pelicula.trim(); // Elimina espacios en blanco

    let connection; // Definir la variable de conexión aquí
    try {
        connection = await database.getConnection();
        console.log("Conexión a la base de datos establecida.");

        // Verificar si la película existe usando LOWER() para comparación insensible
        const [pelicula] = await connection.query("SELECT * FROM Pelicula WHERE LOWER(titulo) = LOWER(?)", [nombre_pelicula]);
        if (pelicula.length === 0) {
            console.log("Película no encontrada:", nombre_pelicula);
            return res.status(404).json({ message: "Película no encontrada." });
        }

        const id_pelicula = pelicula[0].id_pelicula;

        // Eliminar referencias en la tabla Disponibilidad
        await connection.query("DELETE FROM Disponibilidad WHERE id_pelicula = ?", [id_pelicula]);
        console.log("Referencias eliminadas de la tabla Disponibilidad.");

        // Eliminar referencias en las tablas intermedias
        await connection.query("DELETE FROM listado_disponible_por_plataforma WHERE id_pelicula = ?", [id_pelicula]);
        await connection.query("DELETE FROM listado_disponible_por_sala WHERE id_pelicula = ?", [id_pelicula]);
        await connection.query("DELETE FROM Pelicula_Actores WHERE pelicula_id = ?", [id_pelicula]);

        // Eliminar la película
        await connection.query("DELETE FROM Pelicula WHERE id_pelicula = ?", [id_pelicula]);
        console.log("Película eliminada de la tabla Pelicula.");

        res.status(200).send("Película eliminada con éxito.");
    } catch (error) {
        console.error("Error general al eliminar la película:", error);
        res.status(500).json({ message: "Ocurrió un error interno en el servidor." });
    } finally {
        if (connection) {
            await connection.end(); // Asegúrate de cerrar la conexión si se abrió
        }
    }
});


/*NO LO APLICAMOS AUN EN EL FRONTEND*/
app.get("/peliculas/actor/:nombre", async (req, res) => {
    const { nombre } = req.params;

    try {
        const connection = await database.getConnection();

        // Consulta para buscar el ID del actor por su nombre
        const [actor] = await connection.query("SELECT id_actor FROM Actor WHERE nombre = ?", [nombre]);

        if (actor.length === 0) {
            return res.status(404).json({ message: "Actor no encontrado." });
        }

        // Obtener las películas en las que participa el actor
        const [peliculas] = await connection.query(
            `SELECT P.* FROM Pelicula P
             JOIN Pelicula_Actores PA ON P.id_pelicula = PA.pelicula_id
             WHERE PA.actor_id = ?`, [actor[0].id_actor]
        );

        // Si el actor no participa en ninguna película
        if (peliculas.length === 0) {
            return res.status(404).json({ message: "El actor no participa en ninguna película." });
        }

        // Devolver las películas encontradas
        res.status(200).json(peliculas);

    } catch (error) {
        console.error("Error al obtener las películas del actor:", error);
        res.status(500).json({ message: "Ocurrió un error interno en el servidor." });
    }
});


/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.get("/peliculas/:id/disponibilidad", async (req, res) => {
    const { id } = req.params; // Obtiene el ID de la película de la URL

    try {
        const connection = await database.getConnection();

        // Consulta para verificar la disponibilidad de la película
        const [result] = await connection.query(`
            SELECT medio 
            FROM Disponibilidad 
            WHERE id_pelicula = ?
        `, [id]);

        if (result.length === 0) {
            return res.status(404).json({ message: "No se encontró información de disponibilidad para esta película." });
        }

        res.json(result); // Devuelve la disponibilidad de la película
    } catch (err) {
        console.error("Error al obtener la disponibilidad de la película:", err);
        res.status(500).json({ message: "Ocurrió un error interno en el servidor." });
    }
});

/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.get("/plataformas", async (req, res) => {
    try {
        const connection = await database.getConnection();
        const [plataformas] = await connection.query("SELECT id_plataforma_online, nombre FROM Plataforma_Online");
        res.json(plataformas);
    } catch (error) {
        console.error("Error al obtener plataformas:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});


/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.get("/salas", async (req, res) => {
    try {
        const connection = await database.getConnection();
        const [salas] = await connection.query(
            "SELECT MIN(id_sala_de_cine) AS id_sala_de_cine, MIN(direccion) AS direccion, nombre FROM Sala_De_Cine GROUP BY nombre"
        );
        res.json(salas);
    } catch (error) {
        console.error("Error al obtener salas de cine:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

const apiKey = 'pk.d3a2ba95ea88dcdcfbe3e45acb0c9f19'; // Reemplaza con tu clave real

/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.post('/salas', async (req, res) => {
    const { nombre, direccion, url } = req.body;
    const apiKey = 'pk.d3a2ba95ea88dcdcfbe3e45acb0c9f19';

    try {
        // Obtener la latitud y longitud de la dirección
        const response = await axios.get('https://us1.locationiq.com/v1/search.php', {
            params: {
                key: apiKey,
                q: direccion,
                format: 'json'
            }
        });

        // Obtener los valores de latitud y longitud
        const latitud = response.data[0].lat;
        const longitud = response.data[0].lon;

        // Insertar la nueva sala en la base de datos
        const connection = await database.getConnection();
        
        // Verificar si la sala ya existe
        const [existingSala] = await connection.query(
            'SELECT * FROM Sala_De_Cine WHERE nombre = ? AND direccion = ?', 
            [nombre, direccion]
        );

        if (existingSala.length > 0) {
            return res.status(409).json({ error: 'Ya existe una sala de cine con ese nombre y dirección.' });
        }

        await connection.query('INSERT INTO Sala_De_Cine (nombre, direccion, url, latitud, longitud) VALUES (?, ?, ?,?, ?)', 
            [nombre, direccion, url, latitud, longitud]);

        res.status(201).json({ message: `Sala de cine ${nombre} agregada con éxito.` });

    } catch (error) {
        console.error('Error al buscar la dirección:', error);
        res.status(500).json({ error: 'Error al buscar la dirección' });
    }
});


/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.delete('/salas', async (req, res) => {
    const { nombre, direccion } = req.body;

    if (!nombre || !direccion) {
        return res.status(400).json({ message: 'Nombre y dirección son obligatorios.' });
    }

    try {
        const connection = await database.getConnection();

        // Primero, obtener el ID de la sala
        const [sala] = await connection.query('SELECT id_sala_de_cine FROM Sala_De_Cine WHERE nombre = ? AND direccion = ?', [nombre, direccion]);

        if (sala.length === 0) {
            return res.status(404).json({ message: 'Sala de cine no encontrada.' });
        }

        // Luego, eliminar las disponibilidades asociadas usando el ID
        await connection.query('DELETE FROM Disponibilidad WHERE id_sala IN (SELECT id_sala_de_cine FROM Sala_De_Cine WHERE nombre = ? AND direccion = ?)', [nombre, direccion]);

        // Finalmente, eliminar la sala de cine
        const [result] = await connection.query('DELETE FROM Sala_De_Cine WHERE nombre = ? AND direccion = ?', [nombre, direccion]);
        
        if (result.affectedRows > 0) {
            res.status(200).json({ message: `Sala de cine ${nombre} eliminada con éxito.` });
        } else {
            res.status(404).json({ message: 'Sala de cine no encontrada.' });
        }
    } catch (error) {
        console.error('Error al eliminar sala de cine:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
});


/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.post('/salasCercanas', async (req, res) => {
    const { lat, lon } = req.body;

    try {
        const connection = await database.getConnection();
        
        // Consulta para obtener salas y películas disponibles
        const [salas] = await connection.query(`
            SELECT s.*, p.titulo, p.sinopsis
            FROM Sala_De_Cine s
            LEFT JOIN Disponibilidad d ON s.id_sala_de_cine = d.id_sala
            LEFT JOIN Pelicula p ON d.id_pelicula = p.id_pelicula
        `);

        const salasCercanas = {};

        salas.forEach(sala => {
            const distancia = calcularDistancia(lat, lon, sala.latitud, sala.longitud);
            if (distancia <= 5) { // Filtra solo las salas cercanas
                if (!salasCercanas[sala.nombre]) { // Asegúrate de que el nombre no esté duplicado
                    salasCercanas[sala.nombre] = {
                        ...sala,
                        distancia,
                        peliculas: [] // Inicializa un array para las películas
                    };
                }
                // Agrega la película a la sala
                if (sala.titulo) {
                    salasCercanas[sala.nombre].peliculas.push({titulo: sala.titulo, sinopsis: sala.sinopsis});
                }
            }
        });

        // Convierte el objeto de salas a un array
        res.json(Object.values(salasCercanas));
    } catch (error) {
        console.error('Error al obtener salas:', error);
        res.status(500).json({ error: 'Error al obtener salas' });
    }
});


/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.post('/plataformas', async (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ message: 'El nombre de la plataforma es obligatorio.' });
    }

    try {
        const connection = await database.getConnection();
        const [result] = await connection.query('INSERT INTO Plataforma_Online (nombre) VALUES (?)', [nombre]);
        
        res.status(201).json({ message: `Plataforma ${nombre} agregada con éxito.` });
    } catch (error) {
        console.error('Error al agregar plataforma:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
});

/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.delete('/plataformas', async (req, res) => {
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ message: 'El nombre de la plataforma es obligatorio.' });
    }

    try {
        const connection = await database.getConnection();
        const [result] = await connection.query('DELETE FROM Plataforma_Online WHERE nombre = ?', [nombre]);
        
        if (result.affectedRows > 0) {
            res.status(200).json({ message: `Plataforma ${nombre} eliminada con éxito.` });
        } else {
            res.status(404).json({ message: 'Plataforma no encontrada.' });
        }
    } catch (error) {
        console.error('Error al eliminar plataforma:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
});

/*SI LO APLICAMOS AUN EN EL FRONTEND*/
app.get('/plataformas', async (req, res) => {
    try {
        const connection = await database.getConnection();
        const [results] = await connection.query('SELECT * FROM Plataforma_Online');

        res.status(200).json(results);
    } catch (error) {
        console.error('Error al obtener plataformas:', error);
        res.status(500).json({ message: 'Error en el servidor.' });
    }
});


async function hashPasswords() {
    try {
        const connection = await database.getConnection();

        // Obtiene todos los usuarios
        const [users] = await connection.query("SELECT * FROM Usuario");

        for (const user of users) {
            // Solo hash la contraseña si está en texto plano
            if (user.contrasenia && !user.contrasenia.startsWith('$2b$')) { // Comprobando si ya es un hash de bcrypt
                const hashedPassword = await bcrypt.hash(user.contrasenia, 10);
                
                // Actualiza la contraseña en la base de datos
                await connection.query(
                    "UPDATE Usuario SET contrasenia = ? WHERE id_usuario = ?",
                    [hashedPassword, user.id_usuario]
                );

                console.log(`Contraseña actualizada para el usuario: ${user.email}`);
            }
        }

        console.log("Todas las contraseñas han sido actualizadas.");
    } catch (error) {
        console.error("Error al actualizar contraseñas:", error);
    }
}

// Llama a la función para actualizar las contraseñas
hashPasswords();

function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radio de la Tierra en kilómetros
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
        
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
    const distancia = R * c; // Distancia en kilómetros

    return distancia;
}

// Función auxiliar para convertir grados a radianes
function toRad(deg) {
    return deg * (Math.PI / 180);
}



