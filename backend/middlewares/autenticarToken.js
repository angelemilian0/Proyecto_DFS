const jwt = require('jsonwebtoken');

/**
 * Middleware para autenticar un token JWT en las solicitudes HTTP.
 * 
 * @param {Object} req - Objeto de solicitud de Express.
 * @param {Object} res - Objeto de respuesta de Express.
 * @param {Function} next - Función para pasar al siguiente middleware o controlador.
 */
function autenticarToken(req, res, next) {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Acceso denegado' });

  try {
      const verificado = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = verificado;
      next();
  } catch (err) {
      res.status(400).json({ error: 'Token inválido' });
  }
}

function verificarRol(roles) {
  return (req, res, next) => {
      if (!roles.includes(req.usuario.role)) {
          return res.status(403).json({ error: 'Acceso denegado' });
      }
      next();
  };
}

module.exports = { autenticarToken, verificarRol };