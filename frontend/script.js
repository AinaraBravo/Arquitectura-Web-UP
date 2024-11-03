// 1. Control del carrusel
document.getElementById('next').onclick = function() {
    let lists = document.querySelectorAll('.item');
    document.getElementById('slide').appendChild(lists[0]);
};

document.getElementById('prev').onclick = function() {
    let lists = document.querySelectorAll('.item');
    document.getElementById('slide').prepend(lists[lists.length - 1]);
};

// 2. Función para obtener y mostrar todas las películas al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    fetchMovies(); // Cargar películas al iniciar
});

// Función para obtener películas
async function fetchMovies() {
    console.log('Ejecutando fetchMovies'); // Agrega esto
    try {
        const response = await fetch('http://localhost:4000/Peliculas'); // Ajusta el puerto si es necesario
        if (!response.ok) {
            throw new Error('Error al obtener las películas');
        }
        const movies = await response.json();
        displayMovies(movies);
    } catch (error) {
        console.error(error);
        alert('No se pudieron cargar las películas');
    }
}


// 3. Función para mostrar los detalles de las películas en el contenedor
function displayMovies(movies) {
    const container = document.getElementById('movies-container');
    container.innerHTML = ''; // Limpiar el contenedor

    if (movies.length === 0) {
        container.innerHTML = '<p>No hay películas disponibles.</p>';
        return;
    }

    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.className = 'movie-item';
        movieItem.innerHTML = `
            <div class="movie-title">${movie.titulo || "Título no disponible"}</div>
            <div class="movie-details">
                <strong>Género:</strong> ${movie.genero || "No disponible"} <br>
                <strong>Año:</strong> ${movie.año || "No disponible"} <br>
                <strong>Duración:</strong> ${movie.duracion || "No disponible"} min <br>
                <strong>Sinopsis:</strong> ${movie.sinopsis || "No disponible"}
            </div>
        `;
        container.appendChild(movieItem);
    });
}

// Evento para el enlace de Películas
document.getElementById('movies').onclick = function(event) {
    event.preventDefault(); // Evitar el comportamiento por defecto del enlace
    console.log('Clic en Películas'); // Agrega esto
    fetchMovies(); // Llamar a la función para cargar películas
};

// 5. Evento para el formulario de búsqueda
document.getElementById('search-form').onsubmit = function(event) {
    event.preventDefault(); // Previene la recarga de la página
    const nombre = document.getElementById('search-input').value.trim();
    
    if (!nombre) {
        alert("Por favor, ingrese un nombre de película");
        return;
    }
    
    buscarPeliculaPorNombre(nombre);
};

// 6. Función para mostrar un mensaje en el contenedor
function displayMessage(message) {
    const container = document.getElementById('movies-container');
    container.innerHTML = `<p>${message}</p>`;
}

// 7. Función para mostrar detalles de la película
function showMovieDetails(movie) {
    const detailsContainer = document.getElementById('movie-details');
    detailsContainer.innerHTML = `
        <h2>Detalles de la Película</h2>
        <div><strong>Título:</strong> ${movie.titulo || "Título no disponible"}</div>
        <div><strong>Género:</strong> ${movie.genero || "No disponible"}</div>
        <div><strong>Año:</strong> ${movie.año || "No disponible"}</div>
        <div><strong>Duración:</strong> ${movie.duracion || "No disponible"} min</div>
        <div><strong>Sinopsis:</strong> ${movie.sinopsis || "No disponible"}</div>
    `;
}
