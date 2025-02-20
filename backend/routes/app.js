// Evento para manejar el cambio entre 'profesor' y 'alumno'
document.getElementById('userType').addEventListener('change', function() {
    const loginFields = document.getElementById('loginFields');
    const btnRegistro = document.getElementById('btnRegistro');
    
    if (this.value === 'profesor') {
        loginFields.style.display = 'block'; // Mostrar login
        btnRegistro.style.display = 'none'; // Ocultar registro
    } else if (this.value === 'alumno') {
        loginFields.style.display = 'none'; // Ocultar login
        btnRegistro.style.display = 'block'; // Mostrar registro
    }
});

// Redirección al formulario de registro
document.getElementById('btnRegistro').addEventListener('click', function() {
    window.location.href = 'index.html';
});

// Cargar usuarios desde la API
async function cargarUsuarios() {
    try {
        const response = await fetch('/api/usuarios', {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        
        const usuarios = await response.json();
        const listaUsuarios = document.getElementById('listaUsuarios');
        listaUsuarios.innerHTML = '';

        usuarios.forEach(usuario => {
            const li = document.createElement('li');
            li.textContent = `${usuario.nombre} - ${usuario.email}`;
            
            const btnEditar = document.createElement('button');
            btnEditar.textContent = 'Editar';
            btnEditar.onclick = () => editarUsuario(usuario);
            
            const btnEliminar = document.createElement('button');
            btnEliminar.textContent = 'Eliminar';
            btnEliminar.onclick = () => eliminarUsuario(usuario._id);
            
            li.appendChild(btnEditar);
            li.appendChild(btnEliminar);
            listaUsuarios.appendChild(li);
        });
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
    }
}

// Registro de usuario
document.getElementById('registroForm')?.addEventListener('submit', async (event) => {
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
            alert('Usuario registrado con éxito');
            document.getElementById('registroForm').reset();
            await cargarUsuarios();
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectarse con el servidor.');
    }
});

// Inicio de sesión
document.getElementById('loginForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();

    const userType = document.getElementById('userType').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (userType === 'alumno') {
        window.location.href = 'index.html';
        return;
    } else if (userType === 'profesor') {
        if (email === 'profesor@gmail.com' && password === 'profesor') {
            window.location.href = 'profesor_dashboard.html';
            return;
        } else {
            alert('Credenciales de profesor incorrectas.');
            return;
        }
    }

    try {
        const response = await fetch('/api/usuarios/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, userType }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Inicio de sesión exitoso');
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
        } else {
            alert(`Error: ${data.error}`);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectarse con el servidor.');
    }
});

// Llamar a cargarUsuarios solo en el dashboard del profesor
if (window.location.pathname.includes('profesor_dashboard.html')) {
    cargarUsuarios();
}
