const jwt = require('jsonwebtoken');

/**
 * Middleware para autenticar un token JWT en las solicitudes HTTP.
 */
function autenticarToken(req, res, next) {
  // Obtenemos el token del encabezado 'Authorization' de la solicitud
  const token = req.header('Authorization');
  
  // Si no hay token, retornamos error 401 (Acceso denegado)
  if (!token) return res.status(401).json({ error: 'Acceso denegado' });

  try {
    // Verificamos la validez del token usando la clave secreta
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    
    // Almacenamos la información del usuario en la solicitud (req)
    req.usuario = verificado;

    // Continuamos con el siguiente middleware o controlador
    next();
  } catch (err) {
    // Si el token no es válido, respondemos con error 400
    res.status(400).json({ error: 'Token inválido' });
  }
}

/**
 * Middleware para verificar si el usuario tiene permisos de administrador.
 */
function verificarAdmin(req, res, next) {
  // Verificamos que el rol del usuario sea 'admin'
  if (req.usuario.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso restringido a administradores' });
  }
  
  // Continuamos con el siguiente middleware o controlador si es admin
  next();
}

module.exports = { autenticarToken, verificarAdmin };