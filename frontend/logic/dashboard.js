// ==================== CONFIGURACIÓN ====================
const API_URL = '/api/usuarios';
let currentPage = 1; // ✅ Asegurar que solo está declarada una vez
const limit = 5; // Número de usuarios por página

// ✅ Cargar usuarios desde la API
async function cargarUsuarios(page = 1) {
    try {
        console.log(`📌 Intentando cargar usuarios para la página ${page}...`);

        const token = localStorage.getItem('token');
        if (!token) {
            alert("No estás autenticado. Inicia sesión nuevamente.");
            window.location.href = "login.html";
            return;
        }

        const response = await fetch(`${API_URL}/all?page=${page}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Error al obtener usuarios');
        }

        const data = await response.json();
        console.log("✅ Usuarios obtenidos:", data);

        if (!Array.isArray(data.usuarios) || data.usuarios.length === 0) {
            console.warn("⚠ No hay usuarios en esta página.");
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

        // ✅ Actualizar variables de paginación
        currentPage = data.currentPage; 
        window.totalPages = data.totalPages || 1;
        console.log(`📌 Página actualizada: ${currentPage} de ${window.totalPages}`);

        // ✅ Actualizar la UI de paginación
        document.getElementById('paginaActual').textContent = `Página ${currentPage} de ${window.totalPages}`;
        document.getElementById('btnAnterior').disabled = (currentPage <= 1);
        document.getElementById('btnSiguiente').disabled = (currentPage >= window.totalPages);

    } catch (error) {
        console.error('❌ Error al cargar usuarios:', error);
        alert(`Error: ${error.message}`);
    }
}

// ✅ Configurar eventos de los botones de paginación
document.addEventListener("DOMContentLoaded", () => {
    console.log("🚀 Cargando usuarios desde dashboard.js...");
    cargarUsuarios(1); // ✅ Cargar la primera página al iniciar

    // ✅ Asegurar que el botón de registrar alumno funciona
    const btnAgregarUsuario = document.getElementById('btnAgregarUsuario');
    if (btnAgregarUsuario) {
        btnAgregarUsuario.addEventListener("click", () => {
            console.log("📌 Botón de 'Registrar Alumno' presionado.");
            agregarUsuario();
        });
    } else {
        console.error("❌ No se encontró el botón 'Registrar Alumno'.");
    }

    document.getElementById('btnSiguiente').addEventListener('click', () => {
        if (currentPage < window.totalPages) {
            currentPage++;
            console.log(`➡️ Avanzando a la página ${currentPage}`);
            cargarUsuarios(currentPage);
        } else {
            console.warn("⚠ Ya estás en la última página.");
        }
    });

    document.getElementById('btnAnterior').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            console.log(`⬅️ Retrocediendo a la página ${currentPage}`);
            cargarUsuarios(currentPage);
        } else {
            console.warn("⚠ Ya estás en la primera página.");
        }
    });
});
