document.getElementById('get-location-btn').addEventListener('click', obtenerUbicacion);

// Función para obtener la ubicación del usuario
function obtenerUbicacion() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(enviarUbicacion, manejarError);
    } else {
        alert("Geolocalización no es soportada por este navegador.");
    }
}

// Función para manejar el éxito de la obtención de la ubicación
function enviarUbicacion(position) {
    const latitudUsuario = position.coords.latitude;
    const longitudUsuario = position.coords.longitude;

    // Llamar al backend para obtener las salas cercanas
    fetch('http://localhost:4000/SalasCercanas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            lat: latitudUsuario,
            lon: longitudUsuario
        })
    })
    .then(response => {
        console.log('Response:', response); // Añade esto para ver la respuesta
        if (!response.ok) {
            throw new Error('Error al obtener las salas cercanas');
        }
        return response.json();
    })
    .then(salas => {
        console.log('Salas cercanas:', salas); // Verifica los datos que regresan
        mostrarSalasCercanas(salas);
    })
    .catch(error => {
        console.error(error);
        alert('No se pudieron obtener las salas cercanas.');
    });
}

// Función para manejar errores en la geolocalización
function manejarError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("Se denegó el permiso para obtener la ubicación.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("La ubicación no está disponible.");
            break;
        case error.TIMEOUT:
            alert("Se agotó el tiempo para obtener la ubicación.");
            break;
        case error.UNKNOWN_ERROR:
            alert("Error desconocido.");
            break;
    }
}

// Función para mostrar las salas cercanas en la interfaz
function mostrarSalasCercanas(salas) {
    const contenedorSalas = document.getElementById('contenedorSalas'); // Asegúrate de tener este contenedor en tu HTML

    // Limpiar contenido previo
    contenedorSalas.innerHTML = '';

    if (salas.length === 0) {
        contenedorSalas.innerHTML = '<p>No se encontraron salas cercanas.</p>';
        return;
    }

    // Mostrar cada sala y sus películas
    salas.forEach(sala => {
        const salaElemento = document.createElement('div');
        salaElemento.classList.add('sala'); // Agrega clase para estilizar si lo deseas
        salaElemento.innerHTML = `
            <h3>${sala.nombre}</h3>
            <p>Dirección: ${sala.direccion}</p>
            <p>Distancia: ${sala.distancia.toFixed(2)} km</p>
            <p>Películas Disponibles:</p>
            <table>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Sinopsis</th>
                    </tr>
                </thead>
                <tbody>
                    ${sala.peliculas.length > 0 
                        ? sala.peliculas.map(pelicula => `<tr><td>${pelicula.titulo}</td><td>${pelicula.sinopsis}</td></tr>`).join('') 
                        : '<tr><td colspan="2">No hay películas disponibles</td></tr>'}
                </tbody>
            </table>
        `;
        contenedorSalas.appendChild(salaElemento);
    });
}

// Llamar a obtenerUbicacion cuando se hace clic en el botón
