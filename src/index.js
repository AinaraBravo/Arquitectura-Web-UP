const express = require("express");
const morgan = require("morgan");
const database = require("./database");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');



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

app.get("/Peliculas",async(req,res)=>{
    const connection = await database.getConnection();
    const result = await connection.query("SELECT * from Pelicula");
    res.json(result)    
    //Devuelve listado de peliculas por consola
    console.log(result);
    

})

app.get("/Peliculas/:id_pelicula", async (req, res) => {
    const { id_pelicula } = req.params; // Obtiene el id_pelicula de la URL
    try {
        const connection = await database.getConnection();
        const [result] = await connection.query(
            "SELECT * FROM Pelicula WHERE id_pelicula = ?", [id_pelicula] // Pasa el id_pelicula como parámetro a la consulta
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "ID Película no encontrado" });
        }

        res.json(result[0]); // Devuelve solo la película encontrada
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ocurrio un error interno en el servidor al intentar obtener los datos" });
    }
});

app.get("/Peliculas/nombre/:nombre", async (req, res) => {
    const { nombre } = req.params; // Obtiene el nombre de la película de la URL

    try {
        const connection = await database.getConnection();
        const [result] = await connection.query(
            "SELECT * FROM Pelicula WHERE titulo = ?", [nombre] // Busca por el título de la película
        );

        if (result.length === 0) {
            return res.status(404).json({ message: "Película no encontrada" });
        }

        res.json(result[0]); // Devuelve solo la película encontrada
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ocurrió un error interno en el servidor al intentar obtener los datos" });
    }
});


app.get("/Peliculas/genero/:genero", async (req, res) => {
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


app.post("/Usuarios/:id/favoritos", async (req, res) => {
    const userId = req.params.id; // Obtiene el ID del usuario desde la URL
    const { id_pelicula } = req.body; // Obtiene el ID de la película desde el cuerpo de la solicitud

    try {
        const connection = await database.getConnection();

        // Verifica si el usuario existe
        const [user] = await connection.query("SELECT * FROM Usuario WHERE id_usuario = ?", [userId]);
        if (user.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

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

        res.status(200).json({ message: "Película agregada a favoritos" }); // Respuesta exitosa
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ocurrió un error interno al agregar la película a la lista de favoritos" });
    }
});

app.get("/Usuarios/:id/favoritos", async (req, res) => {
    const userId = req.params.id; // Obtiene el ID del usuario desde la URL

    try {
        const connection = await database.getConnection();

        // Verifica si el usuario existe
        const [user] = await connection.query("SELECT * FROM Usuario WHERE id_usuario = ?", [userId]);
        if (user.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        // Obtiene las películas favoritas del usuario
        const [favoritos] = await connection.query(`
            SELECT P.* 
            FROM Favoritos F
            JOIN Pelicula P ON F.id_pelicula = P.id_pelicula
            WHERE F.id_usuario = ?
        `, [userId]);

        res.status(200).json(favoritos); // Respuesta exitosa con las películas favoritas

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Ocurrió un error interno al obtener las películas favoritas" });
    }
});


// Crear un nuevo usuario
app.post('/usuarios', async (req, res) => {
    const { nombre, email, contrasenia, rol } = req.body;

    // Asegúrate de que los datos necesarios estén presentes
    if (!nombre || !email || !contrasenia) {
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
            "INSERT INTO Usuario (nombre, email, contrasenia, rol) VALUES (?, ?, ?, ?)", 
            [nombre, email, hashedPassword, rol || 'usuario'] // Asignar 'usuario' si no se proporciona rol
        );

        res.status(201).json({ message: "Usuario creado con éxito." });
    } catch (error) {
        console.error("Error al crear usuario:", error);
        res.status(500).json({ message: "Error al crear el usuario." });
    }
});


// Endpoint para actualizar la contraseña
app.put('/usuarios/:email/cambiar-contrasenia', async (req, res) => {
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

// Endpoint para iniciar sesión
app.post('/login', async (req, res) => {
    const { email, contrasenia } = req.body; // Verifica que el cuerpo de la solicitud tenga los campos correctos

    if (!email || !contrasenia) {
        return res.status(400).json({ message: "Se requiere email y contraseña." });
    }

    try {
        const connection = await database.getConnection();
        
        // Busca el usuario por email
        const [user] = await connection.query(
            "SELECT id_usuario, nombre, email, contrasenia, rol FROM Usuario WHERE email = ?",
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
});

app.post("/Peliculas/:id/calificar", async (req, res) => {
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

app.post("/Peliculas/:id/comentarios", async (req, res) => {
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

        // Opción 2: Si decides registrar el id_usuario
        // const token = req.headers.authorization?.split(" ")[1]; 
        // if (token) {
        //     const decoded = jwt.verify(token, jwt_secret);
        //     const id_usuario = decoded.id_usuario;
        //     await connection.query(
        //         "INSERT INTO Comentarios (id_pelicula, id_usuario, comentario) VALUES (?, ?, ?)",
        //         [id, id_usuario, comentario]
        //     );
        // } else {
        //     await connection.query(
        //         "INSERT INTO Comentarios (id_pelicula, comentario) VALUES (?, ?)",
        //         [id, comentario]
        //     );
        // }

        res.status(200).json({ message: "Comentario registrado." });
    } catch (err) {
        console.error("Error al registrar el comentario:", err);
        res.status(500).json({ message: "Error al registrar el comentario." });
    }
});

app.get("/Peliculas/mejores-calificaciones/:anio", async (req, res) => {
    const { anio } = req.params; // Obtiene el año de la URL

    try {
        const connection = await database.getConnection();

        // Consulta para obtener las películas mejor calificadas del año específico
        const [result] = await connection.query(`
            SELECT p.titulo, p.genero, p.año, AVG(c.calificacion) AS promedio_calificacion
            FROM Pelicula p
            JOIN Calificaciones c ON p.id_pelicula = c.id_pelicula
            WHERE YEAR(c.fecha) = ?
            GROUP BY p.id_pelicula
            ORDER BY promedio_calificacion DESC
            LIMIT 5
        `, [anio]);

        if (result.length === 0) {
            return res.status(404).json({ message: "No se encontraron películas para el año especificado." });
        }

        res.json(result); // Devuelve las películas con su calificación promedio
    } catch (err) {
        console.error("Error al obtener las mejores calificaciones:", err);
        res.status(500).json({ message: "Ocurrió un error interno en el servidor." });
    }
});


app.get("/Peliculas/:id/comentarios", async (req, res) => {
    const { id } = req.params; // ID de la película

    try {
        const connection = await database.getConnection();
        
        // Obtener comentarios de la película
        const [comentarios] = await connection.query(
            "SELECT c.id_comentario, c.comentario, c.fecha, u.nombre FROM Comentarios c LEFT JOIN Usuario u ON c.id_usuario = u.id_usuario WHERE c.id_pelicula = ?",
            [id]
        );

        res.json(comentarios);
    } catch (err) {
        console.error("Error al obtener los comentarios:", err);
        res.status(500).json({ message: "Error al obtener los comentarios." });
    }
});



app.post('/solicitar-restablecimiento', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Se requiere un email." });
    }

    try {
        const connection = await database.getConnection();
        const [user] = await connection.query(
            "SELECT * FROM Usuario WHERE email = ?",
            [email]
        );

        if (user.length === 0) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // Aquí deberías generar un token y enviarlo por correo electrónico
        const token = jwt.sign({ id_usuario: user[0].id_usuario }, JWT_SECRET, { expiresIn: '1h' });

        // Enviar el token al email del usuario (esto es un ejemplo, deberías usar un servicio de email)
        console.log(`Enviar este enlace para restablecer la contraseña: http://tu-dominio.com/restablecer-contrasenia?token=${token}`);

        res.status(200).json({ message: "Se ha enviado un enlace para restablecer la contraseña a tu correo." });
    } catch (error) {
        console.error("Error al solicitar restablecimiento de contraseña:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

app.post('/restablecer-contrasenia', async (req, res) => {
    const { token, nuevaContrasenia } = req.body;

    if (!token || !nuevaContrasenia) {
        return res.status(400).json({ message: "Se requiere un token y una nueva contraseña." });
    }

    try {
        // Verifica el token
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Hashea la nueva contraseña
        const hashedPassword = await bcrypt.hash(nuevaContrasenia, 10);
        
        // Actualiza la contraseña en la base de datos
        const connection = await database.getConnection();
        await connection.query(
            "UPDATE Usuario SET contrasenia = ? WHERE id_usuario = ?",
            [hashedPassword, decoded.id_usuario]
        );

        res.status(200).json({ message: "Contraseña restablecida exitosamente." });
    } catch (error) {
        console.error("Error al restablecer la contraseña:", error);
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ message: "Token inválido." });
        }
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

app.post("/Peliculas", authenticateJWT, async (req, res) => {
    let { titulo, genero, año, actores, sinopsis, duracion, plataformas, salas_de_cine } = req.body;

    // Lista de géneros válidos
    const generosValidos = ['Acción', 'Comedia', 'Drama', 'Terror', 'Ciencia Ficción', 'Aventura', 'Documental', 'Romance'];

    // Verificar que todos los campos obligatorios estén presentes
    if (!titulo || !genero || !año || !actores || !sinopsis || !duracion) {
        return res.status(400).json({ message: "Faltan datos obligatorios." });
    }

    // Convertir duracion a un número entero
    duracion = parseInt(duracion);
    if (isNaN(duracion)) {
        return res.status(400).json({ message: "La duración debe ser un número entero." });
    }

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

        // Insertar actores en la tabla intermedia
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

            // Inserta en la tabla intermedia
            await connection.query(
                "INSERT INTO Pelicula_Actores (pelicula_id, actor_id) VALUES (?, ?)",
                [result.insertId, actorId]
            );
        }

        // Insertar disponibilidad en tablas de Plataforma y Sala de Cine
        if (plataformas && plataformas.length > 0) {
            for (const plataformaId of plataformas) {
                await connection.query(
                    "INSERT INTO Disponibilidad (pelicula_id, plataforma_id) VALUES (?, ?)",
                    [result.insertId, plataformaId]
                );
            }
        }

        if (salas_de_cine && salas_de_cine.length > 0) {
            for (const salaId of salas_de_cine) {
                await connection.query(
                    "INSERT INTO Disponibilidad (pelicula_id, sala_de_cine_id) VALUES (?, ?)",
                    [result.insertId, salaId]
                );
            }
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




app.delete("/Peliculas/:id_pelicula", authenticateJWT, async (req, res) => {
    const id_pelicula = req.params.id_pelicula;

    try {
        const connection = await database.getConnection();

        // Verificar si la película existe
        const [pelicula] = await connection.query("SELECT * FROM Pelicula WHERE id_pelicula = ?", [id_pelicula]);
        if (pelicula.length === 0) {
            return res.status(404).json({ message: "Película no encontrada." });
        }

        // Eliminar la película
        await connection.query("DELETE FROM Pelicula WHERE id_pelicula = ?", [id_pelicula]);

        
        res.status(200).send("Pelicula eliminada con exito.");

    } catch (error) {
        console.error("Error al eliminar la película:", error);
        res.status(500).json({ message: "Ocurrió un error interno en el servidor." });
    }
});

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

app.get("/Peliculas/:id/disponibilidad", async (req, res) => {
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

//Proporcionar un listado de plataformas y salas de cine
app.get("/plataformas", async (req, res) => {
    try {
        const connection = await database.getConnection();
        const [plataformas] = await connection.query("SELECT * FROM Plataforma_Online");
        res.json(plataformas);
    } catch (error) {
        console.error("Error al obtener plataformas:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});


app.get("/salas", async (req, res) => {
    try {
        const connection = await database.getConnection();
        const [salas] = await connection.query("SELECT * FROM Sala_De_Cine");
        res.json(salas);
    } catch (error) {
        console.error("Error al obtener salas de cine:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
});

app.get("/salas-cercanas", async (req, res) => {
    const { latitud, longitud } = req.query;

    if (!latitud || !longitud) {
        return res.status(400).json({ message: "Debe proporcionar latitud y longitud." });
    }

    try {
        const connection = await database.getConnection();

        // 1. Obtener las salas de cine más cercanas
        const [salas] = await connection.query(
            `SELECT sc.id_sala_de_cine, sc.nombre, sc.direccion, sc.url,
                (6371 * acos(cos(radians(?)) * cos(radians(sc.latitud)) * cos(radians(sc.longitud) - radians(?)) + sin(radians(?)) * sin(radians(sc.latitud)))) AS distancia
            FROM Sala_De_Cine sc
            ORDER BY distancia
            LIMIT 10`,
            [latitud, longitud, latitud]
        );

        if (salas.length === 0) {
            return res.status(404).json({ message: "No se encontraron salas cercanas." });
        }

        // 2. Obtener las películas disponibles en las salas cercanas
        const idsSalas = salas.map(sala => sala.id_sala_de_cine);
        const [peliculas] = await connection.query(
            `SELECT p.titulo, p.genero, p.año, p.duracion, sc.id_sala_de_cine
            FROM Pelicula p
            JOIN Listado_Disponible_Por_Sala lps ON p.id_pelicula = lps.id_pelicula
            JOIN Sala_De_Cine sc ON lps.id_sala_de_cine = sc.id_sala_de_cine
            WHERE sc.id_sala_de_cine IN (?)`,
            [idsSalas]
        );

        // 3. Crear la estructura que agrupa salas con sus películas
        const resultado = salas.map(sala => {
            const peliculasSala = peliculas.filter(pelicula => pelicula.id_sala_de_cine === sala.id_sala_de_cine);
            return {
                id_sala_de_cine: sala.id_sala_de_cine,
                nombre: sala.nombre,
                direccion: sala.direccion,
                distancia: sala.distancia,
                url: sala.url,  // Añadir el campo URL
                peliculas: peliculasSala.map(p => ({
                    titulo: p.titulo,
                    genero: p.genero,
                    año: p.año,
                    duracion: p.duracion
                }))
            };
        });

        // 4. Enviar la respuesta con las salas y sus películas
        res.status(200).json(resultado);
    } catch (error) {
        console.error("Error al obtener salas cercanas y películas:", error);
        res.status(500).json({ message: "Error interno del servidor." });
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
