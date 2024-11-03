document.addEventListener('DOMContentLoaded', () => {
    // Función para Agregar Sala de Cine
    document.getElementById('addMovieBtn').addEventListener('click', async () => {
        const nombre = document.getElementById('nombreSalaAgregar').value.trim();
        const direccion = document.getElementById('direccionSalaAgregar').value.trim();
        const barrio = document.getElementById('barrioSalaAgregar').value.trim();
        const url = document.getElementById('urlSalaAgregar').value.trim();

        if (!nombre || !direccion || !barrio) {
            alert('Por favor, completa todos los campos obligatorios (nombre, dirección y barrio).');
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/Salas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, direccion, barrio, url })
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                // Opcional: Actualizar la lista de salas o limpiar los campos
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error al agregar sala de cine:', error);
            alert('Hubo un error al agregar la sala de cine.');
        }
    });

    // Función para Eliminar Sala de Cine
    document.getElementById('deleteMovieBtn').addEventListener('click', async () => {
        const nombre = document.getElementById('nombreSalaEliminar').value.trim();
        const direccion = document.getElementById('direccionSalaEliminar').value.trim();

        if (!nombre || !direccion) {
            alert('Por favor, completa todos los campos obligatorios (nombre y dirección).');
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/Salas', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre, direccion })
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                // Opcional: Actualizar la lista de salas
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error al eliminar sala de cine:', error);
            alert('Hubo un error al eliminar la sala de cine.');
        }
    });
});
