// ==================== CONFIGURACIÓN ====================
// URL base de la API donde se registrarán los usuarios
const API_URL = 'http://localhost:4003/api/usuarios';

// ==================== MANEJO DEL FORMULARIO DE REGISTRO ====================
document.getElementById('registroForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Previene la recarga de la página al enviar el formulario
    
    // Obtener valores ingresados en los campos del formulario
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        // Realizar petición a la API para registrar al usuario
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST', // Método HTTP para crear un nuevo usuario
            headers: { 
                'Content-Type': 'application/json', // Especifica que el contenido es JSON
                'Accept': 'application/json' // Acepta respuesta en formato JSON
            },
            body: JSON.stringify({ nombre, email, password }), // Convertir datos a JSON
        });

        // Verificar si la respuesta de la API es exitosa
        if (!response.ok) {
            const errorData = await response.json(); // Obtener el mensaje de error del servidor
            throw new Error(errorData.error || 'Error al registrar usuario'); // Lanza un error con el mensaje recibido
        }

        // Obtener datos de la respuesta exitosa
        const data = await response.json();
        console.log('Registro exitoso:', data);
        alert('Usuario registrado con éxito');

        // Resetear el formulario después de un registro exitoso
        document.getElementById('registroForm').reset();

        // Redirigir a la página de login
        window.location.href = 'login.html';
    } catch (error) {
        // Captura y muestra cualquier error ocurrido durante el proceso
        console.error('Error detallado:', error);
        alert('Error al registrar: ' + error.message);
    }
});
