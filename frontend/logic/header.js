// Lógica para el botón de regresar en el header
document.addEventListener('DOMContentLoaded', () => {
    const backButton = document.querySelector('.menu-toggle'); // Selecciona el botón de menú

    if (backButton) {
        backButton.addEventListener('click', () => {
            window.history.back(); // Regresa a la página anterior
        });
    }
});