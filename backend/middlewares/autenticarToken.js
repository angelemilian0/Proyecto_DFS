// Importamos el módulo jsonwebtoken para trabajar con tokens JWT
const jwt = require('jsonwebtoken');

/**
 * Middleware para autenticar un token JWT en las solicitudes HTTP.
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware o controlador.
 */
function autenticarToken(req, res, next) {
  // Obtenemos el token del encabezado 'Authorization' de la solicitud
  const token = req.header('Authorization'); 

  // Si no se proporciona un token, retornamos un error 401 (Acceso denegado)
  if (!token) return res.status(401).json({ error: 'Acceso denegado' });

  try {
    // Verificamos la validez del token usando la clave secreta almacenada en las variables de entorno
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    
    // Si el token es válido, almacenamos la información del usuario en el objeto de la solicitud (req)
    req.usuario = verificado;

    // Llamamos a next() para pasar el control al siguiente middleware o controlador
    next();
  } catch (err) {
    // Si la verificación del token falla, enviamos una respuesta con error 400 (Token inválido)
    res.status(400).json({ error: 'Token inválido' });
  }
}

// Exportamos la función para que pueda ser utilizada en otras partes de la aplicación
module.exports = autenticarToken;
