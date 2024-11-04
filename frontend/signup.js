document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    const messageDiv = document.getElementById('messageDiv'); // Div para mostrar mensajes

    signupForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevenir el envío del formulario por defecto

        // Obtener los valores de los campos del formulario
        const nombre = document.getElementById('nameInput').value;
        const email = document.getElementById('emailInput').value;
        const contrasenia = document.getElementById('passwordInput').value;
        const plan = document.getElementById('planSelect').value;
        // Crear el objeto de datos
        const userData = {
            nombre: nombre,
            email: email,
            contrasenia: contrasenia,
            rol: 'usuario',// Puedes cambiar el rol si es necesario
            plan:plan
        };

        try {
            // Enviar la solicitud al backend
            const response = await fetch('http://localhost:4000/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            // Manejar la respuesta
            if (response.ok) {
                const result = await response.json();
                messageDiv.innerHTML = `<p style="color: green;">${result.message}</p>`; // Mensaje de éxito
                messageDiv.style.display = 'block'; // Mostrar el div
                // Redirigir a la página de inicio o donde sea necesario
                setTimeout(() => {
                    window.location.href = 'login.html'; // Redireccionar después de 2 segundos
                }, 2000);
            } else {
                const errorResult = await response.json();
                messageDiv.innerHTML = `<p style="color: red;">${errorResult.message}</p>`; // Mensaje de error
                messageDiv.style.display = 'block'; // Mostrar el div
            }
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
            messageDiv.innerHTML = `<p style="color: red;">Ocurrió un error al registrar el usuario.</p>`; // Mensaje genérico de error
            messageDiv.style.display = 'block'; // Mostrar el div
        }
    });
});
