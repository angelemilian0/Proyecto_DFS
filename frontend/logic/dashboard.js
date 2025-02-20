// URL base de la API donde se encuentran los usuarios
const API_URL = '/api/usuarios/all';

/**
 * Carga la lista de usuarios desde la API y la muestra en la interfaz.
 */
async function cargarUsuarios() {
    try {
        // Realiza una petición GET a la API para obtener la lista de usuarios
        const response = await fetch(API_URL);
        const usuarios = await response.json(); // Convierte la respuesta en JSON
        
        // Selecciona el elemento HTML donde se mostrará la lista de usuarios
        const listaUsuarios = document.getElementById('listaUsuarios');
        listaUsuarios.innerHTML = ''; // Limpia la lista antes de actualizarla

        // Itera sobre cada usuario recibido de la API
        usuarios.forEach(usuario => {
            const tr = document.createElement('tr');
            const tdNombre = document.createElement('td');
            tdNombre.textContent = usuario.nombre; // Muestra el nombre del usuario
            const tdEmail = document.createElement('td');
            tdEmail.textContent = usuario.email; // Muestra el email del usuario
            const tdAcciones = document.createElement('td');

            // Botón para editar usuario
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.onclick = () => editarUsuario(usuario); // Llama a la función de edición
            
            // Botón para eliminar usuario
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.style.backgroundColor = 'red'; // Pone el botón de eliminar en color rojo
            btnEliminar.onclick = () => eliminarUsuario(usuario._id); // Usa el ID correcto
            
            // Agrega los botones a la celda de acciones
            tdAcciones.appendChild(btnEditar);
            tdAcciones.appendChild(btnEliminar);
            tr.appendChild(tdNombre);
            tr.appendChild(tdEmail);
            tr.appendChild(tdAcciones);
            listaUsuarios.appendChild(tr);
        });
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
}

/**
 * Permite editar los datos de un usuario mediante una solicitud PUT a la API.
 * @param {Object} usuario - Objeto con los datos del usuario a editar.
 */
async function editarUsuario(usuario) {
    console.log("Intentando editar usuario con ID:", usuario._id); // Verifica el ID en la consola

    // Solicita los nuevos datos al usuario
    const nuevoNombre = prompt("Ingrese el nuevo nombre:", usuario.nombre);
    const nuevoEmail = prompt("Ingrese el nuevo email:", usuario.email);
    const nuevaPassword = prompt("Ingrese la nueva contraseña:");

    // Verifica que los datos sean válidos antes de enviarlos
    if (nuevoNombre && nuevoEmail) {
        try {
            // Realiza una solicitud PUT a la API para actualizar los datos
            const response = await fetch(`${API_URL}/${usuario._id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    nombre: nuevoNombre,
                    email: nuevoEmail,
                    password: nuevaPassword
                }),
            });

            // Verifica si la actualización fue exitosa
            if (response.ok) {
                alert('Usuario editado con éxito');
                cargarUsuarios(); // Recarga la lista actualizada
            } else {
                const data = await response.json();
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectarse con el servidor.');
        }
    }
}

/**
 * Permite eliminar un usuario enviando una solicitud DELETE a la API.
 * @param {string} id - ID del usuario a eliminar.
 */
async function eliminarUsuario(id) {
    console.log("Intentando eliminar usuario con ID:", id); // Verifica el ID en la consola

    // Confirma antes de proceder con la eliminación
    if (confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
        try {
            // Realiza la petición DELETE a la API
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
            });

            // Verifica si la eliminación fue exitosa
            if (response.ok) {
                alert('Usuario eliminado con éxito');
                cargarUsuarios(); // Recarga la lista después de eliminar
            } else {
                const data = await response.json();
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectarse con el servidor.');
        }
    }
}

/**
 * Permite agregar un nuevo usuario mediante una solicitud POST a la API.
 */
async function agregarUsuario() {
    const nombre = prompt("Ingrese el nombre del nuevo usuario:");
    const email = prompt("Ingrese el email del nuevo usuario:");
    const password = prompt("Ingrese la contraseña del nuevo usuario:");

    if (nombre && email && password) {
        try {
            const response = await fetch(API_URL + '/register', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ nombre, email, password }),
            });

            if (response.ok) {
                alert('Usuario agregado con éxito');
                cargarUsuarios(); // Recarga la lista después de agregar
            } else {
                const data = await response.json();
                alert(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectarse con el servidor.');
        }
    }
}

// Carga la lista de usuarios al iniciar la página
window.onload = cargarUsuarios;

// Agrega el evento al botón de agregar usuario
document.getElementById('btnAgregarUsuario').addEventListener('click', agregarUsuario);