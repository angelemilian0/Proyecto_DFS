const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware para autenticar un token JWT en las solicitudes HTTP.
 */
function autenticarToken(req, res, next) {
    const authHeader = req.header('Authorization');

    // Si no hay token, retornar error 401 (Acceso denegado)
    if (!authHeader) {
        return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token' });
    }

    // Dividir para extraer el token del formato "Bearer TOKEN"
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token no válido o no proporcionado' });
    }

    try {
        // Verificamos la validez del token
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = verificado;  // ✅ Se asigna el usuario decodificado a `req.usuario`
        console.log("Usuario autenticado:", req.usuario);
        next();
    } catch (err) {
        console.error("Error verificando el token:", err);
        res.status(400).json({ error: 'Token inválido o expirado' });
    }
}

/**
 * Middleware para verificar si el usuario tiene permisos de administrador.
 */
function verificarAdmin(req, res, next) {
    if (!req.usuario || req.usuario.role !== 'admin') {
        return res.status(403).json({ error: 'Acceso restringido a administradores' });
    }
    next();
}

module.exports = { autenticarToken, verificarAdmin };
