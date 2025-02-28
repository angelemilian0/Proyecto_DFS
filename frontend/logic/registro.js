// ==================== CONFIGURACIÓN ====================
// URL base de la API donde se registran los usuarios
const API_URL = '/api/usuarios';

/**
 * Maneja el envío del formulario de registro.
 */
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('registroForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/api/usuarios/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                alert('Registro exitoso. Ahora puedes iniciar sesión.');
                window.location.href = 'login.html';
            } else {
                throw new Error(data.error || 'Error en el registro');
            }
        } catch (error) {
            console.error('Error en registro:', error);
            alert(`Error: ${error.message}`);
        }
    });
});