const inputs = document.querySelectorAll(".input-field");
const toggle_btn = document.querySelectorAll(".toggle");
const main = document.querySelector("main");
const bullets = document.querySelectorAll(".bullets span");
const images = document.querySelectorAll(".image");

inputs.forEach((inp) => {
  inp.addEventListener("focus", () => {
    inp.classList.add("active");
  });
  inp.addEventListener("blur", () => {
    if (inp.value != "") return;
    inp.classList.remove("active");
  });
});

toggle_btn.forEach((btn) => {
  btn.addEventListener("click", () => {
    main.classList.toggle("sign-up-mode");
  });
});

function moveSlider() {
    let index = this.dataset.value; // Obtener el índice del slider

    // Seleccionar la imagen actual usando template literals
    let currentImage = document.querySelector(`.img-${index}`);
    images.forEach((img) => img.classList.remove("show")); // Remover la clase "show" de todas las imágenes
    currentImage.classList.add("show"); // Agregar la clase "show" a la imagen actual

    const textSlider = document.querySelector(".text-group");
    // Usar template literals para ajustar el transform
    textSlider.style.transform = `translateY(${-(index - 1) * 2.2}rem)`;

    bullets.forEach((bull) => bull.classList.remove("active")); // Remover la clase "active" de todos los bullets
    this.classList.add("active"); // Agregar la clase "active" al bullet actual
}

// Asumiendo que 'bullets' es un NodeList de tus elementos bullet
bullets.forEach((bullet) => {
    bullet.addEventListener("click", moveSlider); // Añadir el evento click
});


const loginBtn = document.getElementById('login-btn');

loginBtn.addEventListener('click', async () => {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  try {
    const response = await fetch("http://localhost:4000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: username,
        contrasenia: password
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error en la solicitud de inicio de sesión");
    }

    const data = await response.json();
    localStorage.setItem("token", data.token); // Almacena el token recibido
    localStorage.setItem('isLoggedIn', 'true'); // Guarda el estado de sesión

    // Verificar si el usuario es el administrador
    if (username === "rosie.love@example.com") {
      console.log("Redirigiendo a dashboard/admin.html"); // Debugging
      window.location.href = 'admin.html'; // Redirige a la página del administrador
  } else {
      console.log("Redirigiendo a inicio.html"); // Debugging
      window.location.href = 'inicio.html'; // Redirige a la página de inicio
  }
  
  } catch (error) {
    console.error("Error:", error);
    alert('Usuario o contraseña incorrectos. Inténtalo de nuevo.');
  }
});



document.getElementById('toggle-update-password').addEventListener('click', function() {
  const signInForm = document.querySelector('.sign-in-form');
  const updatePasswordForm = document.querySelector('.update-password-form');

  signInForm.style.display = signInForm.style.display === 'none' ? 'block' : 'none';
  updatePasswordForm.style.display = updatePasswordForm.style.display === 'none' ? 'block' : 'none';
});

document.getElementById('update-btn').addEventListener('click', async function() {
  const currentPassword = document.getElementById('current-password').value;
  const newPassword = document.getElementById('new-password').value;
  const confirmPassword = document.getElementById('confirm-password').value;
  const email = document.getElementById('email').value;

  if (newPassword !== confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
  }

  try {
      const response = await fetch(`http://localhost:4000/usuarios/${email}/cambiar-contrasenia`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
              // 'Authorization': `Bearer ${yourToken}` // Solo si es necesario
          },
          body: JSON.stringify({
              nueva_contrasenia: newPassword
          }),
      });

      const data = await response.json();
      console.log('Response:', data); // Para ver la respuesta

      if (response.ok) {
          alert(data.message);
      } else {
          alert(data.message);
      }
  } catch (error) {
      console.error("Error al actualizar la contraseña:", error);
      alert("Hubo un problema al intentar actualizar la contraseña.");
  }
});
