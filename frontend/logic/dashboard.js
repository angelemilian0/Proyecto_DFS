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

let currentPage = 1; // ✅ Página inicial
const limit = 5; // ✅ Cantidad de usuarios por página

async function cargarUsuarios(page = 1) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("No estás autenticado. Inicia sesión nuevamente.");
            window.location.href = "login.html";
            return;
        }

        const response = await fetch(`/api/usuarios/all?page=${page}&limit=5`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();
        console.log("✅ Datos recibidos de la API:", data);

        if (!Array.isArray(data.usuarios) || data.usuarios.length === 0) {
            console.warn("⚠ No hay usuarios para mostrar.");
            document.getElementById('listaUsuarios').innerHTML = `<tr><td colspan="3">No hay usuarios</td></tr>`;
            return;
        }

        // ✅ Limpiar la tabla antes de agregar nuevos datos
        const listaUsuarios = document.getElementById('listaUsuarios');
        listaUsuarios.innerHTML = '';

        // ✅ Insertar cada usuario en la tabla
        data.usuarios.forEach(usuario => {
            console.log(`👤 Agregando usuario: ${usuario.nombre} (${usuario.email})`);
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

        // ✅ Actualizar paginación
        currentPage = data.currentPage;
        window.totalPages = data.totalPages || 1;
        console.log(`📌 Página actualizada: ${currentPage} de ${window.totalPages}`);

        // ✅ Actualizar la UI de paginación
        document.getElementById('paginaActual').textContent = `Página ${currentPage} de ${window.totalPages}`;
        document.getElementById('btnAnterior').disabled = (currentPage <= 1);
        document.getElementById('btnSiguiente').disabled = (currentPage >= window.totalPages);

    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        alert(`Error: ${error.message}`);
    }
}

// ✅ Cargar la primera página de usuarios al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarUsuarios(currentPage);
});

// ✅ Manejo de botones de paginación
document.getElementById('btnSiguiente').addEventListener('click', async () => {
    if (currentPage < window.totalPages) {
        console.log(`➡️ Avanzando a la página ${currentPage + 1}`);
        await cargarUsuarios(currentPage + 1);
    }
});

document.getElementById('btnAnterior').addEventListener('click', async () => {
    if (currentPage > 1) {
        console.log(`⬅️ Retrocediendo a la página ${currentPage - 1}`);
        await cargarUsuarios(currentPage - 1);
    }
});

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

        const response = await fetch(`${API_URL}/api/usuarios/register`, {
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
 * Cierra sesión eliminando el token y redirigiendo a la pantalla de login.
 */
function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('nombre');
    window.location.href = "login.html";
}

// Asigna la función al botón de cerrar sesión cuando la página cargue
document.addEventListener('DOMContentLoaded', () => {
    const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', cerrarSesion);
    }
});

/**
 * Obtiene el clima de una ciudad ingresada por el usuario.
 */
async function obtenerClima() {
    const ciudad = prompt("Ingrese el nombre de su ciudad:");

    if (!ciudad) {
        alert("Por favor, ingrese una ciudad válida.");
        return;
    }

    try {
        const response = await fetch(`/api/clima/${ciudad}`);
        const data = await response.json();

        if (data.error) {
            alert("Error al obtener el clima. Intenta nuevamente.");
            return;
        }

        // Muestra la información del clima en la interfaz
        document.getElementById('climaInfo').innerHTML = `
            <strong>${data.name}</strong>: ${data.weather[0].description}, 
            <strong>${data.main.temp}°C</strong>, 
            Humedad: ${data.main.humidity}%
        `;

    } catch (error) {
        console.error("Error al obtener el clima:", error);
        alert("No se pudo obtener la información del clima.");
    }
}

// Asigna el evento al botón de clima
document.addEventListener('DOMContentLoaded', () => {
    const btnClima = document.getElementById('btnClima');
    if (btnClima) {
        btnClima.addEventListener('click', obtenerClima);
    }
});

// ✅ Corrección: Esperar a que el DOM cargue antes de ejecutar `cargarUsuarios`
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('listaUsuarios')) {
        cargarUsuarios();
    }
});
