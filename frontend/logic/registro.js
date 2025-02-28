// ==================== CONFIGURACIÓN ====================
// URL base de la API donde se registran los usuarios
const API_URL = '/api/usuarios';

/**
 * Maneja el envío del formulario de registro.
 */
document.getElementById('registroForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Evita la recarga de la página

    // Obtiene los valores ingresados en el formulario
    const nombre = document.getElementById('registroNombre').value;
    const email = document.getElementById('registroEmail').value;
    const password = document.getElementById('registroPassword').value;

    try {
        // Realiza una petición POST a la API de registro
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre, email, password }),
        });

        const data = await response.json();

        // Si la respuesta es exitosa, redirige al login
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
