document.addEventListener('DOMContentLoaded', () => {
    // 🔹 Botón de hamburguesa
    const menuToggle = document.querySelector('.menu-toggle');

    // 🔹 Crear el menú lateral oculto
    const menuContainer = document.createElement('div');
    menuContainer.classList.add('menu-container');
    menuContainer.style.position = 'absolute';
    menuContainer.style.top = '60px'; // Ajuste para que quede debajo del botón
    menuContainer.style.left = '10px'; // Posiciona el menú cerca del botón hamburguesa
    menuContainer.style.background = '#ffffff';
    menuContainer.style.border = '1px solid #ccc';
    menuContainer.style.boxShadow = '2px 2px 10px rgba(0,0,0,0.2)';
    menuContainer.style.padding = '10px';
    menuContainer.style.display = 'none'; // Oculto por defecto
    menuContainer.style.borderRadius = '8px';
    menuContainer.style.zIndex = '1000';

    // 🔹 Opción de "Ir a Inicio de Sesión"
    const loginButton = document.createElement('button');
    loginButton.textContent = 'Ir a Inicio de Sesión';
    loginButton.classList.add('menu-option');
    loginButton.style.display = 'block';
    loginButton.style.padding = '10px';
    loginButton.style.width = '100%';
    loginButton.style.border = 'none';
    loginButton.style.background = 'transparent';
    loginButton.style.cursor = 'pointer';
    loginButton.style.textAlign = 'left';
    loginButton.style.fontSize = '16px';

    // Cambia el color al pasar el cursor sobre el botón
    loginButton.addEventListener('mouseover', () => {
        loginButton.style.background = '#f0f0f0';
    });

    loginButton.addEventListener('mouseout', () => {
        loginButton.style.background = 'transparent';
    });

    // Redirige al login cuando se hace clic
    loginButton.onclick = () => {
        window.location.href = 'login.html';
    };

    // Agregar la opción al menú y el menú al cuerpo del documento
    menuContainer.appendChild(loginButton);
    document.body.appendChild(menuContainer);

    // 🔹 Evento para mostrar/ocultar el menú cuando se haga clic en el botón hamburguesa
    menuToggle.addEventListener('click', () => {
        menuContainer.style.display = menuContainer.style.display === 'none' ? 'block' : 'none';
    });

    // 🔹 Cerrar el menú si se hace clic fuera de él
    document.addEventListener('click', (event) => {
        if (!menuContainer.contains(event.target) && event.target !== menuToggle) {
            menuContainer.style.display = 'none';
        }
    });

    // 🔹 Botón de cerrar sesión (dentro del header, en la tuerca)
    const cerrarSesionBtn = document.getElementById('cerrarSesionBtn');
    if (cerrarSesionBtn) {
        cerrarSesionBtn.addEventListener('click', () => {
            localStorage.removeItem('token'); // Eliminamos el token
            localStorage.removeItem('role');  // Eliminamos el rol
            window.location.href = 'login.html'; // Redirigimos al login
        });
    }
});
