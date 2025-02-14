// ==================== VARIABLES GLOBALES ====================
// Elementos del DOM que se utilizan en la interfaz
const userTypeSelect = document.getElementById('userType'); // Selección del tipo de usuario
const loginFields = document.getElementById('loginFields'); // Campos de login (profesores)
const registroDiv = document.getElementById('registroDiv'); // Sección de registro (alumnos)
const loginForm = document.getElementById('loginForm'); // Formulario de login
const btnRegistro = document.getElementById('btnRegistro'); // Botón de registro

// ==================== MANEJO DEL CAMBIO EN EL TIPO DE USUARIO ====================
userTypeSelect.addEventListener('change', function() {
    if (this.value === 'profesor') {
        // Si el usuario selecciona "profesor", se muestra el formulario de login
        loginFields.style.display = 'block';
        registroDiv.style.display = 'none';
    } else if (this.value === 'alumno') {
        // Si el usuario selecciona "alumno", se muestra la opción de registro
        loginFields.style.display = 'none';
        registroDiv.style.display = 'block';
    }
});

// ==================== MANEJO DEL BOTÓN DE REGISTRO (ALUMNOS) ====================
btnRegistro.addEventListener('click', function() {
    window.location.href = 'index.html'; // Redirige a la página de inicio (puede cambiarse si es necesario)
});

// ==================== MANEJO DEL FORMULARIO DE LOGIN ====================
loginForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita la recarga de la página al enviar el formulario
    
    const userType = userTypeSelect.value; // Obtiene el tipo de usuario seleccionado
    
    if (userType === 'profesor') {
        // Obtiene los valores ingresados en los campos de email y contraseña
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        // Validación de credenciales (actualmente hardcodeado)
        if (email === 'profesor@gmail.com' && password === 'profesor') {
            window.location.href = 'profesor_dashboard.html'; // Redirige al dashboard del profesor
        } else {
            alert('Credenciales de profesor incorrectas.'); // Muestra un mensaje de error
        }
    }
});
