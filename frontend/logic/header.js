document.addEventListener('DOMContentLoaded', () => {
    // 🔹 Botón de hamburguesa
    const menuToggle = document.querySelector('.menu-toggle');

    if (!menuToggle) {
        console.error("⚠️ No se encontró el botón ☰ del menú hamburguesa.");
        return;
    }

    // 🔹 Crear el menú lateral oculto
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

    // 🔹 Opción "Ir a Inicio de Sesión"
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

    loginButton.onclick = () => {
        window.location.href = 'login.html';
    };

    // 🔹 Opción "Consultar Clima"
    const climaButton = document.createElement('button');
    climaButton.textContent = 'Consultar Clima 🌦️';
    climaButton.classList.add('menu-option');
    climaButton.style.display = 'block';
    climaButton.style.padding = '10px';
    climaButton.style.width = '100%';
    climaButton.style.border = 'none';
    climaButton.style.background = 'transparent';
    climaButton.style.cursor = 'pointer';
    climaButton.style.textAlign = 'left';
    climaButton.style.fontSize = '16px';

    climaButton.onclick = async () => {
        try {
            const ciudad = prompt("Ingresa la ciudad para consultar el clima:");
            if (!ciudad) {
                alert("Debes ingresar una ciudad.");
                return;
            }

            const response = await fetch(`/api/clima/${ciudad}`);
            const data = await response.json();

            if (response.ok) {
                alert(`🌤️ Ciudad: ${data.name} | Temp: ${data.main.temp}°C | Clima: ${data.weather[0].description}`);
            } else {
                alert(`Error al obtener el clima: ${data.error}`);
            }
        } catch (error) {
            console.error('Error al obtener el clima:', error);
            alert('No se pudo obtener el clima.');
        }
    };

    // 🔹 Agregar botones al menú
    menuContainer.appendChild(loginButton);
    menuContainer.appendChild(climaButton);
    document.body.appendChild(menuContainer);

    // 🔹 Evento para mostrar/ocultar el menú hamburguesa
    menuToggle.addEventListener('click', (event) => {
        event.stopPropagation(); // Evita que el menú se cierre inmediatamente
        menuContainer.style.display = menuContainer.style.display === 'none' ? 'block' : 'none';
    });

    // 🔹 Cerrar el menú si se hace clic fuera de él
    document.addEventListener('click', (event) => {
        if (!menuContainer.contains(event.target) && event.target !== menuToggle) {
            menuContainer.style.display = 'none';
        }
    });

    console.log("✅ Menú hamburguesa inicializado correctamente.");

    // 🔹 Botón de la tuerca ⚙️
    const settingsButton = document.querySelector('.header-icon.settings');

    // Verificar si el botón existe antes de agregar eventos
    if (!settingsButton) {
        console.error("⚠️ No se encontró el botón de configuración (⚙️). Verifica que tenga la clase 'settings'.");
        return;
    }

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

    // Mostrar/ocultar el menú de configuración al hacer clic en la tuerca
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