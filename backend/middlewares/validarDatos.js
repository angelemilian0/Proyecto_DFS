const { body, validationResult } = require('express-validator');

/**
 * Middleware para validar los datos de entrada en las solicitudes.
 */
const validarRegistro = [
    body('nombre')
        .notEmpty().withMessage('El nombre es obligatorio')
        .isLength({ min: 3 }).withMessage('El nombre debe tener al menos 3 caracteres'),
    
    body('email')
        .isEmail().withMessage('El email no es válido'),
    
    body('password')
        .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),

    (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ errores: errores.array() });
        }
        next();
    }
];

const validarLogin = [
    body('email')
        .isEmail().withMessage('El email no es válido'),

    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria'),

    (req, res, next) => {
        const errores = validationResult(req);
        if (!errores.isEmpty()) {
            return res.status(400).json({ errores: errores.array() });
        }
        next();
    }
];

module.exports = { validarRegistro, validarLogin };