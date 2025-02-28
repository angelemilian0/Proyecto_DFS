// ==================== CONFIGURACIÓN ====================
// URL base de la API donde se registran los usuarios
const API_URL = '/api/usuarios';

/**
 * Maneja el envío del formulario de registro.
 */
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('registroForm').addEventListener('submit', async (event) => {
        event.preventDefault();

        const nombre = document.getElementById('registroNombre').value.trim();
        const email = document.getElementById('registroEmail').value.trim();
        const password = document.getElementById('registroPassword').value;


        console.log("➡ Enviando datos:", { nombre, email, password });

        try {
            const response = await fetch('/api/usuarios/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                console.log("Respuesta de la API:", data);
                // 💡 Si `error` es un array, mostrar el primer error
                let mensajeError = Array.isArray(data.errores) ? data.errores[0].msg : data.error;
                throw new Error(mensajeError || 'Error en el registro');
            }

            alert('Registro exitoso. Ahora puedes iniciar sesión.');
            window.location.href = 'login.html';

        } catch (error) {
            console.error('❌ Error en registro:', error);
            alert(`Error: ${error.message}`);
        }
    });
});
