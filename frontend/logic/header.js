document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.createElement('button');
    logoutButton.textContent = 'Cerrar Sesión';
    logoutButton.classList.add('header-icon');
    logoutButton.onclick = () => {
        localStorage.removeItem('token'); // Eliminamos el token
        localStorage.removeItem('role');  // Eliminamos el rol
        window.location.href = 'login.html'; // Redirigimos al login
    };

    // Insertamos el botón en el header si el usuario está autenticado
    const headerRight = document.querySelector('.header-icons');
    if (headerRight) {
        headerRight.appendChild(logoutButton);
    }
});
