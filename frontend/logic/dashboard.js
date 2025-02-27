// ==================== CONFIGURACIÓN ====================
// URL base de la API donde se encuentran los usuarios
const API_URL = '/api/usuarios';

/**
 * Verifica si el usuario está autenticado y tiene permisos de administrador.
 */
function verificarAutenticacion() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'admin') {
        alert("Acceso denegado. Debes iniciar sesión como profesor.");
        window.location.href = "login.html";
    }
}

// Verifica la autenticación antes de cargar la página
verificarAutenticacion();

/**
 * Carga la lista de usuarios desde la API y la muestra en la interfaz.
 */
async function cargarUsuarios() {
    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/all`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Error al obtener usuarios');
        }

        const data = await response.json();
        const listaUsuarios = document.getElementById('listaUsuarios');
        listaUsuarios.innerHTML = '';

        // Itera sobre cada usuario recibido de la API
        data.usuarios.forEach(usuario => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${usuario.nombre}</td>
                <td>${usuario.email}</td>
                <td>
                    <button onclick="editarUsuario('${usuario._id}')">Editar</button>
                    <button onclick="eliminarUsuario('${usuario._id}')" style="background-color: red;">Eliminar</button>
                </td>
            `;
            listaUsuarios.appendChild(tr);
        });

    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        alert('Error al cargar la lista de usuarios.');
    }
}

/**
 * Permite editar los datos de un usuario mediante una solicitud PUT a la API.
 * @param {string} id - ID del usuario a editar.
 */
async function editarUsuario(id) {
    const nuevoNombre = prompt("Ingrese el nuevo nombre:");
    const nuevoEmail = prompt("Ingrese el nuevo email:");
    const nuevaPassword = prompt("Ingrese la nueva contraseña (opcional):");

    if (!nuevoNombre || !nuevoEmail) {
        alert("El nombre y el email son obligatorios.");
        return;
    }

    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nuevoNombre,
                email: nuevoEmail,
                password: nuevaPassword || undefined
            })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al actualizar usuario');

        alert('Usuario editado con éxito');
        cargarUsuarios();

    } catch (error) {
        console.error('Error:', error);
        alert(`Error al actualizar el usuario: ${error.message}`);
    }
}

/**
 * Permite eliminar un usuario enviando una solicitud DELETE a la API.
 * @param {string} id - ID del usuario a eliminar.
 */
async function eliminarUsuario(id) {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
        return;
    }

    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Error al eliminar usuario');
        }

        alert('Usuario eliminado con éxito');
        cargarUsuarios();

    } catch (error) {
        console.error('Error:', error);
        alert(`Error al eliminar usuario: ${error.message}`);
    }
}

/**
 * Permite agregar un nuevo usuario mediante una solicitud POST a la API.
 */
async function agregarUsuario() {
    const nombre = prompt("Ingrese el nombre del nuevo usuario:");
    const email = prompt("Ingrese el email del nuevo usuario:");
    const password = prompt("Ingrese la contraseña del nuevo usuario:");

    if (!nombre || !email || !password) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    try {
        const token = localStorage.getItem('token');

        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre, email, password })
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Error al registrar usuario');

        alert('Usuario agregado con éxito');
        cargarUsuarios();

    } catch (error) {
        console.error('Error:', error);
        alert(`Error al registrar usuario: ${error.message}`);
    }
}

/**
 * Cierra sesión eliminando el token y redirigiendo al login.
 */
function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = 'login.html';
}

// Carga la lista de usuarios al iniciar la página
window.onload = cargarUsuarios;
