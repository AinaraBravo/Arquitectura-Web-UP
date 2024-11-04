document.addEventListener('DOMContentLoaded', async () => {
    const container = document.getElementById('peliculasContainer');
    const userId = 1; // Reemplaza con el ID del usuario que está logueado

    try {
        const response = await fetch('http://localhost:4000/Peliculas'); // Cambia la URL según tu endpoint
        if (!response.ok) {
            throw new Error('Error en la carga de películas');
        }
        const peliculas = await response.json();

        // Llenar el contenedor con los datos de películas
        peliculas.forEach(pelicula => {
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
                <button class="favoritos-btn" data-id="${pelicula.id_pelicula}">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="comentarios-btn" data-id="${pelicula.id_pelicula}">
                     <i class="fas fa-comment"></i> <!-- Icono para Comentarios -->
                </button>
                <button class="calificar-btn" data-id="${pelicula.id_pelicula}">Calificar</button>
                    <!-- Contenedor para las estrellas que estará oculto por defecto -->
                    <div class="calificacion" data-id="${pelicula.id_pelicula}" style="display:none;">
                        <span class="star" data-value="1">&#9733;</span>
                        <span class="star" data-value="2">&#9733;</span>
                        <span class="star" data-value="3">&#9733;</span>
                        <span class="star" data-value="4">&#9733;</span>
                        <span class="star" data-value="5">&#9733;</span>
                    </div>
                <button class="ver-comentarios-btn" data-id="${pelicula.id_pelicula}">
                    <i class="fas fa-eye"></i> 
                </button>
                <div class="comentarios-container" id="comentarios-${pelicula.id_pelicula}" style="display: none;"></div>
    
            `;

            container.appendChild(peliculaCard);
        });
    } catch (error) {
        console.error('Error al cargar las películas:', error);
    }
});

// Función para cargar las películas
async function cargarPeliculas() {
    const container = document.getElementById('peliculasContainer');
    container.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevas películas

    try {
        const response = await fetch('http://localhost:4000/Peliculas');
        const peliculas = await response.json();

        peliculas.forEach(pelicula => {
            // Crear la tarjeta de película
            const peliculaCard = document.createElement('div');
            peliculaCard.classList.add('pelicula-card');
            peliculaCard.setAttribute('data-id', pelicula.id_pelicula); // Agregar ID de película


            container.appendChild(peliculaCard);
        });

        // Manejar el evento de click en el botón de agregar a favoritos
        container.addEventListener('click', async (event) => {
            if (event.target.closest('.favoritos-btn')) {
                const id_pelicula = event.target.closest('.favoritos-btn').dataset.id; // Obtener el ID de la película del botón
                let userCorreo = localStorage.getItem('userCorreo'); // Recupera el correo almacenado
                console.log("Correo recuperado:", userCorreo);
                
                if (!userCorreo) {
                    userCorreo = prompt("Por favor, ingresa tu correo para agregar a favoritos:");
                    if (!userCorreo) {
                        alert("Se requiere un correo para continuar.");
                        return;
                    }
                    // Almacena el correo en localStorage para futuras referencias
                    localStorage.setItem('userCorreo', userCorreo);
                }

                console.log(`Agregando película con ID: ${id_pelicula} a favoritos para el correo: ${userCorreo}`);
             
                try {
                    const response = await fetch(`http://localhost:4000/Usuarios/${userCorreo}/favoritos`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ id_pelicula })
                    });

                    if (response.ok) {
                        alert('Película agregada a favoritos');
                    } else {
                        const errorData = await response.json();
                        alert(errorData.message);
                    }
                } catch (error) {
                    console.error('Error al agregar a favoritos:', error);
                    alert('Error al agregar a favoritos. Intenta nuevamente.');
                }
            }
        });

        container.addEventListener('click', async (event) => {
            if (event.target.closest('.comentarios-btn')) {
                const id_pelicula = event.target.closest('.comentarios-btn').dataset.id; // Obtener el ID de la película
                const comentario = prompt("Por favor, ingresa tu comentario:");
        
                if (!comentario || comentario.trim() === "") {
                    alert("El comentario no puede estar vacío.");
                    return;
                }
        
                const userCorreo = localStorage.getItem('userCorreo'); // Recupera el correo almacenado
                if (!userCorreo) {
                    alert("Usuario no autenticado. Por favor, inicia sesión.");
                    return;
                }
        
                console.log(`Agregando comentario a la película con ID: ${id_pelicula}`);
        
                try {
                    const response = await fetch(`http://localhost:4000/Peliculas/${id_pelicula}/comentarios`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ comentario })
                    });
        
                    if (response.ok) {
                        alert('Comentario agregado.');
                    } else {
                        const errorData = await response.json();
                        alert(errorData.message);
                    }
                } catch (error) {
                    console.error('Error al agregar el comentario:', error);
                    alert('Error al agregar el comentario. Intenta nuevamente.');
                }
            }
        });
        
        // Manejar el evento de click en el botón de calificar
        container.addEventListener('click', (event) => {
            if (event.target.closest('.calificar-btn')) {
                const calificacionDiv = event.target.nextElementSibling; // Obtener el contenedor de calificaciones
                calificacionDiv.style.display = (calificacionDiv.style.display === 'none') ? 'block' : 'none'; // Alternar visibilidad
            }

            // Manejar el evento de calificación
            if (event.target.closest('.star')) {
                const star = event.target.closest('.star');
                const id_pelicula = star.parentElement.dataset.id; // Obtener ID de la película
                const calificacion = star.dataset.value; // Obtener calificación de la estrella seleccionada

                console.log(`Calificando la película con ID: ${id_pelicula} con calificación: ${calificacion}`);

                // Enviar la calificación al servidor
                fetch(`http://localhost:4000/Peliculas/${id_pelicula}/calificar`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ calificacion })
                })
                .then(response => {
                    if (response.ok) {
                        alert('Calificación registrada.');
                        star.parentElement.style.display = 'none'; // Ocultar estrellas después de calificar
                    } else {
                        return response.json().then(data => {
                            alert(data.message);
                        });
                    }
                })
                .catch(error => {
                    console.error('Error al registrar la calificación:', error);
                    alert('Error al registrar la calificación. Intenta nuevamente.');
                });
            }

        });
        
        

    } catch (error) {
        console.error('Error al cargar las películas:', error);
    }
}

// Llama a la función para cargar las películas cuando se cargue el script
cargarPeliculas();

// Función para manejar la búsqueda
async function manejarBusqueda(event) {
    event.preventDefault(); // Evitar el envío del formulario

    const searchTerm = document.getElementById('search-input').value; // Obtener el término de búsqueda
    const resultContainer = document.getElementById('peliculasContainer'); // Contenedor para los resultados

    // Limpiar resultados anteriores
    resultContainer.innerHTML = '';

    if (!searchTerm) {
        alert("Por favor, ingresa un título o género para buscar.");
        return; // Detener si no hay término de búsqueda
    }

    // Intentar buscar primero por título
    try {
        const response = await fetch(`http://localhost:4000/Peliculas/nombre/${encodeURIComponent(searchTerm)}`);
        
        if (response.ok) {
            const pelicula = await response.json();
            mostrarResultadoPelicula(pelicula); // Función para mostrar el resultado
            return; // Salir de la función si se encontró una película
        }

        // Si no se encontró por título, intentar buscar por género
        const responseGenero = await fetch(`http://localhost:4000/Peliculas/genero/${encodeURIComponent(searchTerm)}`);
        
        if (responseGenero.ok) {
            const peliculas = await responseGenero.json();
            mostrarResultadosGeneros(peliculas); // Función para mostrar múltiples resultados
            return;
        }

        // Si no se encontró nada
        resultContainer.innerHTML = '<p>No se encontraron resultados para tu búsqueda.</p>';
    } catch (error) {
        console.error('Error en la búsqueda:', error);
        alert('Ocurrió un error al realizar la búsqueda.');
    }
}

// Función para mostrar el resultado de una película
function mostrarResultadoPelicula(pelicula) {
    const resultContainer = document.getElementById('peliculasContainer');
    const peliculaDiv = document.createElement('div');
    peliculaDiv.innerHTML = `
        <img src="poster${pelicula.id_pelicula}.jpg" alt="${pelicula.titulo}">
        <h2>${pelicula.titulo}</h2>
        <p><strong>Género:</strong> ${pelicula.genero}</p>
        <p><strong>Año:</strong> ${pelicula.año}</p>
        <p>${pelicula.sinopsis}</p>
        <p><strong>Duración:</strong> ${pelicula.duracion} min</p>
        <p><strong>Disponible en:</strong> ${pelicula.plataformas || 'No disponible'}</p>
        <button class="favoritos-btn" data-id="${pelicula.id_pelicula}">
            <i class="fas fa-plus"></i>
        </button>
        <button class="comentarios-btn" data-id="${pelicula.id_pelicula}">
            <i class="fas fa-comment"></i> <!-- Icono para Comentarios -->
        </button>
        <button class="calificar-btn" data-id="${pelicula.id_pelicula}">Calificar</button>
        <div class="calificacion" data-id="${pelicula.id_pelicula}" style="display:none;">
            <span class="star" data-value="1">&#9733;</span>
            <span class="star" data-value="2">&#9733;</span>
            <span class="star" data-value="3">&#9733;</span>
            <span class="star" data-value="4">&#9733;</span>
            <span class="star" data-value="5">&#9733;</span>
        </div>
        <button class="ver-comentarios-btn" data-id="${pelicula.id_pelicula}">
            <i class="fas fa-eye"></i> 
        </button>    
        <div class="comentarios-container" id="comentarios-${pelicula.id_pelicula}" style="display: none;"></div>
        
            
    `;
    resultContainer.appendChild(peliculaDiv);
}

// Función para mostrar múltiples películas por género
function mostrarResultadosGeneros(peliculas) {
    const resultContainer = document.getElementById('peliculasContainer');
    peliculas.forEach(pelicula => {
        const peliculaDiv = document.createElement('div');
        peliculaDiv.innerHTML = `
            <img src="poster${pelicula.id_pelicula}.jpg" alt="${pelicula.titulo}">
            <h2>${pelicula.titulo}</h2>
            <p><strong>Género:</strong> ${pelicula.genero}</p>
            <p><strong>Año:</strong> ${pelicula.año}</p>
            <p>${pelicula.sinopsis}</p>
            <p><strong>Duración:</strong> ${pelicula.duracion} min</p>
            <p><strong>Disponible en:</strong> ${pelicula.plataformas || 'No disponible'}</p>
            <button class="favoritos-btn" data-id="${pelicula.id_pelicula}">
                <i class="fas fa-plus"></i>
            </button>
            <button class="comentarios-btn" data-id="${pelicula.id_pelicula}">
                 <i class="fas fa-comment"></i> <!-- Icono para Comentarios -->
            </button>
            <button class="calificar-btn" data-id="${pelicula.id_pelicula}">Calificar</button>
            <div class="calificacion" data-id="${pelicula.id_pelicula}" style="display:none;">
                <span class="star" data-value="1">&#9733;</span>
                <span class="star" data-value="2">&#9733;</span>
                <span class="star" data-value="3">&#9733;</span>
                <span class="star" data-value="4">&#9733;</span>
                <span class="star" data-value="5">&#9733;</span>
            </div>
            <button class="ver-comentarios-btn" data-id="${pelicula.id_pelicula}">
                <i class="fas fa-eye"></i> 
            </button>
            <div class="comentarios-container" id="comentarios-${pelicula.id_pelicula}" style="display: none;"></div>
    
            
        `;
        resultContainer.appendChild(peliculaDiv);
    });
}

// Llama a manejarBusqueda cuando se envíe el formulario
document.getElementById('search-form').addEventListener('submit', manejarBusqueda);

document.getElementById('peliculasContainer').addEventListener('click', async (event) => {
    if (event.target.classList.contains('ver-comentarios-btn')) {
        const peliculaId = event.target.getAttribute('data-id');
        const comentariosContainer = document.getElementById(`comentarios-${peliculaId}`);
        
        // Toggle de visibilidad
        if (comentariosContainer.style.display === 'none') {
            try {
                // Fetch para obtener comentarios de la película
                const response = await fetch(`http://localhost:4000/Peliculas/${peliculaId}/comentarios`);
                
                if (response.ok) {
                    const comentarios = await response.json();
                    comentariosContainer.innerHTML = ''; // Limpiar comentarios previos
                    comentarios.forEach(comentario => {
                        const comentarioDiv = document.createElement('div');
                        comentarioDiv.classList.add('comentario');
                        comentarioDiv.innerHTML = `
                            <p><strong>${comentario.nombre}:</strong> ${comentario.comentario}</p>
                            <p><small>${comentario.fecha}</small></p>
                        `;
                        comentariosContainer.appendChild(comentarioDiv);
                    });
                    comentariosContainer.style.display = 'block'; // Mostrar comentarios
                } else {
                    comentariosContainer.innerHTML = '<p>No se pudieron cargar los comentarios.</p>';
                }
            } catch (error) {
                console.error('Error al cargar los comentarios:', error);
                comentariosContainer.innerHTML = '<p>Error al cargar los comentarios.</p>';
            }
        } else {
            // Ocultar comentarios si ya están visibles
            comentariosContainer.style.display = 'none';
        }
    }
});
