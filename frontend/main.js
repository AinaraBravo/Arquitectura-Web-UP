let allMovies = []; // Almacena todas las películas
let displayedMovies = []; // Almacena las películas que se muestran actualmente

// Agregar las plataformas y salas de cine a mostrar
let allPlatforms = []; // Almacena todas las plataformas
let allCinemas = []; // Almacena todas las salas de cine

// Función para obtener y mostrar las películas desde el servidor
async function fetchMovies() {
    try {
        const response = await fetch('http://localhost:4000/Peliculas');
        allMovies = await response.json();
        displayMovies(allMovies); // Mostrar todas las películas inicialmente
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

// Función para mostrar las películas en la tabla
// Función para mostrar las películas en la tabla
// Función para mostrar las películas en la tabla
function displayMovies(movies) {
    const tableBody = document.getElementById('peliculasTable');
    tableBody.innerHTML = ''; // Limpiar la tabla antes de agregar nuevas filas

    movies.forEach(pelicula => {
        // Asegúrate de que plataformas y salas tengan valores
        const plataformasDisplay = pelicula.plataformas && pelicula.plataformas.trim() !== "" ? pelicula.plataformas : "No disponible";
        const salasDisplay = pelicula.salas && pelicula.salas.trim() !== "" ? pelicula.salas : "No disponible";

        const row = `
            <tr>
                <td>${pelicula.titulo}</td>
                <td>${pelicula.genero}</td>
                <td>${pelicula.duracion} min</td>
                <td>${plataformasDisplay}</td>
                <td>${salasDisplay}</td>
            </tr>
        `;
        tableBody.innerHTML += row; // Agregar fila a la tabla
    });
}




// Función para filtrar películas según el valor seleccionado
function filterMovies() {
    const filterValue = document.getElementById('movieFilter').value;
    let filteredMovies;

    if (filterValue === 'all') {
        filteredMovies = allMovies; // Mostrar todas las películas
    } else {
        const limit = parseInt(filterValue, 10);
        filteredMovies = allMovies.slice(0, limit); // Mostrar la cantidad seleccionada
    }

    displayMovies(filteredMovies); // Mostrar las películas filtradas
}

// Función para obtener y mostrar los usuarios desde el servidor
async function fetchUsuarios() {
    try {
      const response = await fetch('http://localhost:4000/usuarios'); // Cambia la URL según sea necesario
      if (!response.ok) {
        throw new Error('Error al obtener los usuarios');
      }
      const usuarios = await response.json();
      console.log('Usuarios obtenidos:', usuarios); // Agrega este log para verificar los datos
  
      const usuariosTable = document.getElementById('usuariosTable').getElementsByTagName('tbody')[0];
      usuariosTable.innerHTML = ''; // Limpia la tabla antes de llenarla
  
      // Llenar la tabla con datos de usuarios
      usuarios.forEach(usuario => {
        const row = `
          <tr>
              <td>${usuario.nombre}</td>
              <td>${usuario.email}</td>
              <td>${usuario.rol}</td>
              <td>${usuario.plan}</td>
          </tr>`;
        usuariosTable.innerHTML += row;
      });
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
// Función para obtener y mostrar plataformas online
async function fetchPlatforms() {
    try {
        const response = await fetch('http://localhost:4000/plataformas'); // Cambia la URL según sea necesario
        if (!response.ok) {
            throw new Error('Error al obtener las plataformas');
        }
        allPlatforms = await response.json();
        displayPlatforms(allPlatforms); // Mostrar plataformas
    } catch (error) {
        console.error('Error fetching platforms:', error);
    }
}

// Función para mostrar las plataformas en la tabla
function displayPlatforms(platforms) {
    const platformsTable = document.getElementById('plataformasTable').getElementsByTagName('tbody')[0]; // Asegúrate de apuntar al tbody
    platformsTable.innerHTML = ''; // Limpiar la tabla antes de llenarla

    platforms.forEach(plataforma => {
        const row = `
            <tr>
                <td>${plataforma.nombre}</td> <!-- Mostrar solo el nombre -->
            </tr>
        `;
        platformsTable.innerHTML += row; // Agregar fila a la tabla
    });
}


// Función para obtener y mostrar salas de cine
async function fetchCinemas() {
    try {
        const response = await fetch('http://localhost:4000/salas'); // Cambia la URL según sea necesario
        if (!response.ok) {
            throw new Error('Error al obtener las salas de cine');
        }
        allCinemas = await response.json();
        displayCinemas(allCinemas); // Mostrar salas de cine
    } catch (error) {
        console.error('Error fetching cinemas:', error);
    }
}

// Función para mostrar las salas de cine en la tabla
function displayCinemas(cinemas) {
    const cinemasTable = document.getElementById('salasTable').getElementsByTagName('tbody')[0];
    cinemasTable.innerHTML = ''; // Limpiar la tabla antes de llenarla

    cinemas.forEach(sala => {
        const row = `
            <tr>
                <td>${sala.id_sala_de_cine}</td>
                <td>${sala.nombre}</td>
                <td>${sala.direccion}</td>
            </tr>
        `;
        cinemasTable.innerHTML += row; // Agregar fila a la tabla
    });
}


// Llama a la función para obtener las películas y las plataformas y salas al cargar la página
fetchMovies();
fetchUsuarios();
fetchPlatforms();
fetchCinemas();