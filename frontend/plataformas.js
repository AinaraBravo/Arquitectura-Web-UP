document.addEventListener('DOMContentLoaded', () => {
    
    // Función para cargar las plataformas disponibles
    const cargarPlataformas = () => {
        fetch('http://localhost:4000/Plataformas')
            .then(response => {
                if (!response.ok) throw new Error('Error en la respuesta de la red');
                return response.json();
            })
            .then(plataformas => {
                const selectPlataformas = document.getElementById('plataformas');
                selectPlataformas.innerHTML = '<option value="">Seleccionar Plataforma</option>'; // Limpiar opciones existentes

                plataformas.forEach(plataforma => {
                    const option = document.createElement('option');
                    option.value = plataforma.id_plataforma_online; // Usar el ID de la plataforma
                    option.textContent = plataforma.nombre; // Mostrar el nombre de la plataforma
                    selectPlataformas.appendChild(option);
                });
            })
            .catch(error => {
                console.error('Error al cargar plataformas:', error);
            });
    };

    // Llamar a la función para cargar las plataformas
    cargarPlataformas();

    // Función para Agregar Plataforma Online
    document.getElementById('addPlataformaBtn').addEventListener('click', async () => {
        const nombre = document.getElementById('nombrePlataforma').value.trim();

        if (!nombre) {
            alert('Por favor, completa el campo obligatorio (nombre).');
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/Plataformas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre })
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                document.getElementById('nombrePlataforma').value = ''; // Limpiar el campo
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error al agregar plataforma online:', error);
            alert('Hubo un error al agregar la plataforma online.');
        }
    });

    document.getElementById('deletePlataformaBtn').addEventListener('click', async () => {
        const nombre = document.getElementById('nombrePlataformaEliminar').value.trim();

        if (!nombre) {
            alert('Por favor, completa el campo obligatorio (nombre).');
            return;
        }

        try {
            const response = await fetch('http://localhost:4000/Plataformas', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nombre })
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                document.getElementById('nombrePlataformaEliminar').value = ''; // Limpiar el campo
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error al eliminar plataforma online:', error);
            alert('Hubo un error al eliminar la plataforma online.');
        }
    });
});

