
// ================== Función para Eliminar Película ==================
const token = localStorage.getItem("token"); // Asegúrate de que el token se haya guardado previamente

document.getElementById("deleteMovieBtn").addEventListener("click", async () => {
    const titulo = document.getElementById("nombrePelicula").value;

    if (!titulo) {
        alert("Por favor, ingresa el título de la película que deseas eliminar.");
        return;
    }

    // Verificar que el token esté definido
    if (!token) {
        alert("No se pudo encontrar el token de autorización.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/Peliculas/nombre/${encodeURIComponent(titulo)}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Utiliza el token aquí
            }
        });

        if (response.ok) {
            alert(`Película "${titulo}" eliminada exitosamente.`);
        } else if (response.status === 404) {
            alert("Película no encontrada.");
        } else if (response.status === 403) {
            alert("No tienes permisos para realizar esta acción.");
        } else {
            alert("Hubo un problema al eliminar la película.");
        }
    } catch (error) {
        console.error("Error de conexión:", error);
        alert("No se pudo conectar con el servidor. Revisa que esté en funcionamiento.");
    }
});

// ================== Función para Agregar Película ==================
document.getElementById("addMovieBtn").addEventListener("click", async (event) => {
    event.preventDefault(); // Evitar el envío del formulario por defecto

    // Obtener los valores de los campos del formulario
    const titulo = document.getElementById("titulo").value;
    const genero = document.getElementById("genero").value;
    const año = document.getElementById("año").value;
    const sinopsis = document.getElementById("sinopsis").value;
    const duracion = document.getElementById("duracion").value;
    const actores = document.getElementById("actores").value.split(",").map(actor => actor.trim());
    const plataformas = document.getElementById("plataformas").value; // El valor es el ID de la plataforma
    const salasCineInput = document.getElementById("salas_de_cine").value;

    // Verifica si salas de cine está vacío y convierte a array
    const salas_de_cine = salasCineInput ? salasCineInput.split(",").map(sala => sala.trim()) : []; // Si está vacío, asigna un array vacío

    // Obtener el token de autorización
    const token = localStorage.getItem("token"); // Asegúrate de que el token esté guardado

    // Verificar que el token esté definido
    if (!token) {
        alert("No se pudo encontrar el token de autorización.");
        return;
    }

    // Crear el objeto de datos para enviar
    const movieData = {
        titulo,
        genero,
        año: parseInt(año), // Asegúrate de enviar el año como número
        sinopsis,
        duracion: parseInt(duracion), // Asegúrate de enviar la duración como número
        actores,
        plataformas: plataformas ? [plataformas] : [], // Asegúrate de enviar un array
        salas_de_cine // Los IDs de las salas se envían como un array
    };

    try {
        const response = await fetch("http://localhost:4000/Peliculas", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Utiliza el token aquí
            },
            body: JSON.stringify(movieData) // Convierte el objeto a JSON
        });

        // Manejo de la respuesta
        if (response.ok) {
            const result = await response.json();
            alert(`Película "${result.titulo}" agregada exitosamente.`);
            // Limpiar el formulario después de agregar la película
            document.querySelector(".addMovieForm").reset();
        } else if (response.status === 400) {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        } else if (response.status === 409) {
            const errorData = await response.json();
            alert(`Error: ${errorData.message}`);
        } else {
            alert("Hubo un problema al agregar la película.");
        }
    } catch (error) {
        console.error("Error de conexión:", error);
    }
});

// ================== Función para Modificar Película ==================
document.getElementById('updateMovieBtn').addEventListener('click', async function(event) {
    event.preventDefault(); // Evitar el comportamiento predeterminado del botón
    console.log("Botón de actualización clickeado"); // Verificar si el evento se activa

    // Obtener los valores de los campos
    const tituloActualizar = document.getElementById('tituloActualizar').value.trim();
    console.log("Título a actualizar:", tituloActualizar); // Log del título

    // Asegúrate de que se ingrese un título antes de proceder
    if (!tituloActualizar) {
        alert("Por favor, ingresa un título para actualizar.");
        return; // Salir de la función si no hay un título
    }

    const nuevoGenero = document.getElementById('nuevoGenero').value.trim();
    const nuevaPlataforma = document.getElementById('nuevaPlataforma').value.trim();
    const nuevasSalasDeCine = document.getElementById('nuevasSalasDeCine').value.trim();

    // Obtener el token de autorización
    const token = localStorage.getItem("token"); // Asegúrate de que el token esté guardado
    console.log("Token de autorización:", token); // Log del token

    // Preparar el cuerpo de la solicitud
    const body = {};
    if (nuevoGenero) body.genero = nuevoGenero;
    if (nuevaPlataforma) body.plataformas = [nuevaPlataforma]; // Se puede manejar múltiples plataformas como un array
    if (nuevasSalasDeCine) {
        body.salas_de_cine = nuevasSalasDeCine.split(',').map(id => id.trim()); // Separar por comas y quitar espacios
    }

    console.log("Cuerpo de la solicitud:", body); // Log del cuerpo

    try {
        // Realizar la solicitud PUT
        const response = await fetch(`http://localhost:4000/Peliculas/nombre/${tituloActualizar}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Suponiendo que estás usando JWT para la autenticación
            },
            body: JSON.stringify(body)
        });
    
        // Manejar la respuesta
        if (response.ok) {
            const result = await response.json();
            alert(result.message || "Película actualizada exitosamente.");
        } else {
            const errorData = await response.json();
            console.error("Error response data:", errorData); // Log para ver los datos de error
            alert(errorData.message || "Error al actualizar la película.");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Ocurrió un error en la solicitud.");
    }
});
