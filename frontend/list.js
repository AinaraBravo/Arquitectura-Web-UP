async function manejarEntradaCorreo() {
    const email = document.getElementById('emailInput').value; // Obtener el correo ingresado por el usuario
    if (!email) {
        alert("Por favor, ingresa tu correo electrónico.");
        return; // Detener si no se ingresó el correo
    }
    
    console.log("Correo ingresado:", email); // Verificar el correo ingresado
    // Cargar favoritos utilizando el correo
    await cargarFavoritos(email);
}

// Función para cargar las películas favoritas del usuario
async function cargarFavoritos(email) {
    const container = document.getElementById('favoritosContainer');
    const favoritosList = document.getElementById('favoritosList');
    favoritosList.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas películas
    container.style.display = 'block'; // Mostrar el contenedor de favoritos
    
    // Verifica la URL antes de hacer la solicitud
    const url = `http://localhost:4000/usuarios/${email}/favoritos`;
    console.log("URL de la solicitud:", url); 

    try {
        // Obtener las películas favoritas usando el correo del usuario
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Error al cargar las películas favoritas');
        }
        const peliculasFavoritas = await response.json();
        console.log("Películas favoritas obtenidas:", peliculasFavoritas); // Verifica las películas obtenidas

        if (peliculasFavoritas.length === 0) {
            favoritosList.innerHTML = '<p>No tienes películas favoritas.</p>'; // Mensaje si no hay favoritos
            return;
        }

        peliculasFavoritas.forEach(pelicula => {
            const peliculaCard = crearTarjetaPelicula(pelicula); // Crear tarjeta de película
            favoritosList.appendChild(peliculaCard);
        });
    } catch (error) {
        console.error('Error al cargar las películas favoritas:', error);
        favoritosList.innerHTML = '<p>Error al cargar las películas favoritas.</p>'; // Mensaje de error
    }
}



// Función para crear la tarjeta de una película
function crearTarjetaPelicula(pelicula) {
    const peliculaCard = document.createElement('div');
    peliculaCard.classList.add('pelicula');

    peliculaCard.innerHTML = `
        <img src="poster${pelicula.id_pelicula}.jpg" alt="${pelicula.titulo}">
        <h2>${pelicula.titulo}</h2>
        <p><strong>Género:</strong> ${pelicula.genero}</p>
        <p><strong>Año:</strong> ${pelicula.año}</p>
        <p>${pelicula.sinopsis}</p>
        <p><strong>Duración:</strong> ${pelicula.duracion} min</p>
        <p><strong>Disponible en:</strong> ${pelicula.plataformas || 'No disponible'}</p>
    `;

    return peliculaCard;
}

// Llama a esta función cuando necesites cargar y mostrar los favoritos
document.getElementById('showFavoritesBtn').addEventListener('click', manejarEntradaCorreo);

// Lógica para cerrar el contenedor de favoritos
document.getElementById('closeFavoritesBtn').addEventListener('click', () => {
    const container = document.getElementById('favoritosContainer');
    container.style.display = 'none'; // Ocultar el contenedor de favoritos
});
