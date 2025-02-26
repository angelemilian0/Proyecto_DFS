const jwt = require('jsonwebtoken');

function autenticarToken(req, res, next) {
    const token = req.header('Authorization'); 
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
