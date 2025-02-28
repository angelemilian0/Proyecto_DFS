document.addEventListener('DOMContentLoaded', () => {
    // 🔹 Botón de hamburguesa
    const menuToggle = document.querySelector('.menu-toggle');

    // 🔹 Crear el menú lateral oculto para el botón hamburguesa
    const menuContainer = document.createElement('div');
    menuContainer.classList.add('menu-container');
    menuContainer.style.position = 'absolute';
    menuContainer.style.top = '60px';
    menuContainer.style.left = '10px';
    menuContainer.style.background = '#ffffff';
    menuContainer.style.border = '1px solid #ccc';
    menuContainer.style.boxShadow = '2px 2px 10px rgba(0,0,0,0.2)';
    menuContainer.style.padding = '10px';
    menuContainer.style.display = 'none';
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

    loginButton.addEventListener('mouseover', () => {
        loginButton.style.background = '#f0f0f0';
    });

    loginButton.addEventListener('mouseout', () => {
        loginButton.style.background = 'transparent';
    });

    loginButton.onclick = () => {
        window.location.href = 'login.html';
    };

    // Agregar el botón al menú y el menú al cuerpo
    menuContainer.appendChild(loginButton);
    document.body.appendChild(menuContainer);

    // Mostrar/ocultar el menú hamburguesa
    menuToggle.addEventListener('click', () => {
        menuContainer.style.display = menuContainer.style.display === 'none' ? 'block' : 'none';
    });

    // Cerrar el menú si se hace clic fuera de él
    document.addEventListener('click', (event) => {
        if (!menuContainer.contains(event.target) && event.target !== menuToggle) {
            menuContainer.style.display = 'none';
        }
    });

    // 🔹 Botón de configuración (tuerca ⚙️)
    const settingsButton = document.querySelector('.header-icon.settings');

    // 🔹 Crear el menú de configuración
    const settingsMenu = document.createElement('div');
    settingsMenu.classList.add('settings-menu');
    settingsMenu.style.position = 'absolute';
    settingsMenu.style.top = '60px';
    settingsMenu.style.right = '10px'; // Posiciona el menú cerca de la tuerca
    settingsMenu.style.background = '#ffffff';
    settingsMenu.style.border = '1px solid #ccc';
    settingsMenu.style.boxShadow = '2px 2px 10px rgba(0,0,0,0.2)';
    settingsMenu.style.padding = '10px';
    settingsMenu.style.display = 'none';
    settingsMenu.style.borderRadius = '8px';
    settingsMenu.style.zIndex = '1000';

    // 🔹 Opción "Cerrar Sesión"
    const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Cerrar Sesión';
    logoutButton.classList.add('menu-option');
    logoutButton.style.display = 'block';
    logoutButton.style.padding = '10px';
    logoutButton.style.width = '100%';
    logoutButton.style.border = 'none';
    logoutButton.style.background = 'transparent';
    logoutButton.style.cursor = 'pointer';
    logoutButton.style.textAlign = 'left';
    logoutButton.style.fontSize = '16px';

    logoutButton.addEventListener('mouseover', () => {
        logoutButton.style.background = '#f0f0f0';
    });

    logoutButton.addEventListener('mouseout', () => {
        logoutButton.style.background = 'transparent';
    });

    logoutButton.onclick = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('nombre');
        window.location.href = 'login.html';
    };

    // Agregar el botón al menú y el menú al cuerpo
    settingsMenu.appendChild(logoutButton);
    document.body.appendChild(settingsMenu);

    // Mostrar/ocultar el menú configuración al hacer clic en la tuerca
    settingsButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Evita que se cierre inmediatamente el menú
        settingsMenu.style.display = settingsMenu.style.display === 'none' ? 'block' : 'none';
    });

    // Cerrar el menú si se hace clic fuera de él
    document.addEventListener('click', (event) => {
        if (!settingsMenu.contains(event.target) && event.target !== settingsButton) {
            settingsMenu.style.display = 'none';
        }
    });
});
