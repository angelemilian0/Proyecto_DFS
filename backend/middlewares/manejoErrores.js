/**
 * Middleware para manejar errores globalmente en la aplicación.
 * 
 * @param {Object} err - Objeto de error.
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware o controlador.
 */
function manejoErrores(err, req, res, next) {
    console.error(err.stack);
    res.status(500).json({ error: 'Ocurrió un error en el servidor' });
}

module.exports = manejoErrores;