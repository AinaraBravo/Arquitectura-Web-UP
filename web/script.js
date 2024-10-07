document.getElementById('next').onclick = function(){
    let lists = document.querySelectorAll('.item');
    document.getElementById('slide').appendChild(lists[0]);
}
document.getElementById('prev').onclick = function(){
    let lists = document.querySelectorAll('.item');
    document.getElementById('slide').prepend(lists[lists.length - 1]);
}

document.addEventListener('Peliculas', fetchMovies);

async function fetchMovies() {
    try {
        // Cambia la URL al puerto correcto si es necesario
        const response = await fetch('http://localhost:4000/Peliculas');
        if (!response.ok) {
            throw new Error('Error al obtener las películas');
        }

        // Asegúrate de que el JSON esté en el formato correcto
        const movies = await response.json();
        console.log(movies); // Para verificar en la consola que los datos lleguen correctamente

        // Llamar a la función que muestra las películas
        displayMovies(movies);
    } catch (error) {
        console.error(error);
        alert('No se pudieron cargar las películas');
    }
}

function displayMovies(movies) {
    const container = document.getElementById('movies-container');
    container.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas películas

    if (movies.length === 0) {
        container.innerHTML = '<p>No hay películas disponibles.</p>';
        return;
    }

    // Crear cada tarjeta de película dinámicamente
    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.className = 'movie-item';
        movieItem.innerHTML = `
            <div class="movie-title">${movie.titulo}</div>
            <div class="movie-details">
                <strong>Género:</strong> ${movie.genero} <br>
                <strong>Año:</strong> ${movie.año} <br>
                <strong>Duración:</strong> ${movie.duracion} min <br>
                <strong>Sinopsis:</strong> ${movie.sinopsis}
            </div>
        `;
        container.appendChild(movieItem);
    });
}
