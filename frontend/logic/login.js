// ==================== CONFIGURACIÓN ====================
// URL base de la API donde se encuentran los usuarios
const API_URL = '/api/usuarios';

/**
 * Maneja el envío del formulario de inicio de sesión.
 */
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita la recarga de la página

    // Obtiene los valores ingresados en el formulario
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        // Realiza una petición POST a la API de login
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        // Si la respuesta es exitosa, guarda los datos en localStorage
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.role);
            localStorage.setItem('nombre', data.nombre);

            // Redirige según el rol del usuario
            if (data.role === 'admin') {
                window.location.href = 'profesor_dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            throw new Error(data.error || 'Error en el inicio de sesión');
        }

    } catch (error) {
        console.error('Error en login:', error);
        alert(error.message);
    }
});

/**
 * Maneja el cambio de tipo de usuario en el formulario.
 */
document.getElementById('userType').addEventListener('change', function () {
    if (this.value === 'profesor') {
        document.getElementById('loginFields').style.display = 'block';
        document.getElementById('registroDiv').style.display = 'none';
    } else {
        document.getElementById('loginFields').style.display = 'none';
        document.getElementById('registroDiv').style.display = 'block';
    }
});

/**
 * Redirige al formulario de registro si el usuario selecciona "Alumno".
 */
document.getElementById('btnRegistro').addEventListener('click', function () {
    window.location.href = 'index.html';
});
