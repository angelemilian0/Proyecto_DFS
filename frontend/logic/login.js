// ==================== CONFIGURACIÓN ====================
// URL base de la API donde se encuentran los usuarios
const API_URL = '/api/usuarios';

/**
 * Maneja el envío del formulario de inicio de sesión.
 */
document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); 

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('/api/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Error en el inicio de sesión');
        }

        // ✅ Guardar correctamente en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', data.role);
        localStorage.setItem('nombre', data.nombre);

        console.log("Token guardado en localStorage:", data.token);

        // ✅ Redirige según el rol del usuario
        if (data.role === 'admin') {
            window.location.href = 'profesor_dashboard.html';
        } else {
            window.location.href = 'index.html';
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
