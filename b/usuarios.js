
//<!-- ================== Formulario Eliminar Usuario ================== -->         
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('deleteMovieBtn').addEventListener('click', async () => {
        console.log("Botón de eliminar usuario fue presionado");
        
        const email = document.getElementById('emailUsuarioEliminar').value.trim();
        const token = localStorage.getItem("token");
        
        console.log("Email ingresado:", email);
        console.log("Token de autorización:", token);
        
        if (!email) {
            alert('Por favor, ingresa un email.');
            return;
        }
        if (!token) {
            alert('Token de autorización no encontrado.');
            return;
        }
        
        try {
            const response = await fetch(`http://localhost:4000/Usuarios/email/${email}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const result = await response.json();
                alert(result.message);
            } else {
                const error = await response.json();
                alert(error.message);
            }
        } catch (err) {
            console.error('Error al eliminar usuario:', err);
            alert('Hubo un error en la solicitud.');
        }
    });
});

//<!-- ================== Formulario Actualizar Usuario ================== -->
document.getElementById('updateMovieBtn').addEventListener('click', async () => {
    const email = document.getElementById('emailUsuario').value.trim();
    const planNuevo = document.getElementById('planNuevo').value; // Captura el valor del select

    console.log('Email:', email);
    console.log('Nuevo plan:', planNuevo); // Asegúrate de que este valor no sea undefined

    const token = localStorage.getItem("token");

    if (!planNuevo) {
        alert('Por favor, selecciona un plan nuevo.');
        return;
    }

    if (!token) {
        alert('Token de autorización no encontrado.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:4000/Usuarios/email/${email}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ planNuevo }) // Asegúrate de que planNuevo se está enviando aquí
        });

        if (response.ok) {
            const result = await response.json();
            alert(result.message);
        } else {
            const error = await response.json();
            alert(error.message);
        }
    } catch (err) {
        console.error('Error al actualizar plan del usuario:', err);
        alert('Hubo un error en la solicitud.');
    }
});
