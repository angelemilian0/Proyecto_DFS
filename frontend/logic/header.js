document.addEventListener('DOMContentLoaded', () => {
    // 🔹 Botón de hamburguesa para desplegar el menú
    const menuToggle = document.querySelector('.menu-toggle');
    const menuContainer = document.createElement('div');
    menuContainer.classList.add('menu-container');
    menuContainer.style.display = 'none'; // Oculto por defecto

    // 🔹 Opción dentro del menú para ir al login
    const loginButton = document.createElement('button');
    loginButton.textContent = 'Ir a Inicio de Sesión';
    loginButton.classList.add('menu-option');
    loginButton.onclick = () => {
        window.location.href = 'login.html'; // Redirige al login
    };

    // Agregamos el botón de login al menú emergente
    menuContainer.appendChild(loginButton);
    document.body.appendChild(menuContainer);

    // 🔹 Evento para mostrar/ocultar el menú cuando se haga clic en el botón hamburguesa
    menuToggle.addEventListener('click', () => {
        menuContainer.style.display = menuContainer.style.display === 'none' ? 'block' : 'none';
    });

    // 🔹 Botón de cerrar sesión (Opcional, en caso de estar autenticado)
    const cerrarSesionBtn = document.createElement('button');
    cerrarSesionBtn.textContent = 'Cerrar Sesión';
    cerrarSesionBtn.classList.add('header-icon');
    cerrarSesionBtn.onclick = () => {
        localStorage.removeItem('token'); // Eliminamos el token
        localStorage.removeItem('role');  // Eliminamos el rol
        window.location.href = 'login.html'; // Redirigimos al login
    };

    // Insertamos el botón en el header si el usuario está autenticado
    const headerRight = document.querySelector('.header-icons');
    if (headerRight) {
        headerRight.appendChild(cerrarSesionBtn);
    }
});
