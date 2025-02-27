// ==================== PROTECCIÓN DE RUTAS ====================
// Función para verificar si el usuario está autenticado y tiene permisos
function verificarAutenticacion() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    // Si no hay token o el usuario no es admin, redirigir al login
    if (!token || role !== 'admin') {
        alert("Acceso denegado. Debes iniciar sesión como profesor.");
        window.location.href = "login.html";
    }
}

// Ejecutar la verificación solo en páginas restringidas
if (window.location.pathname.includes("profesor_dashboard.html")) {
    verificarAutenticacion();
}
