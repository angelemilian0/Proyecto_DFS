const express = require('express');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const { autenticarToken, verificarRol } = require('../middlewares/autenticarToken');

const router = express.Router();

// Registrar un nuevo usuario
router.post('/register', [
    check('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    check('email').isEmail().withMessage('Debe ser un email válido'),
    check('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { nombre, email, password, role = 'alumno' } = req.body;
        if (await Usuario.findOne({ email })) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const nuevoUsuario = new Usuario({ nombre, email, password: hashedPassword, role });

        const usuarioGuardado = await nuevoUsuario.save();
        const token = jwt.sign({ id: usuarioGuardado._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ id: usuarioGuardado._id, nombre, email, token });
    } catch (err) {
        console.error('Error al registrar usuario:', err);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Iniciar sesión
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ email });

        if (!usuario || !(await bcrypt.compare(password, usuario.password))) {
            return res.status(400).json({ error: 'Credenciales incorrectas' });
        }

        const token = jwt.sign({ id: usuario._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ id: usuario._id, nombre: usuario.nombre, email, token });
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Obtener usuarios con paginación
router.get('/all', autenticarToken, verificarRol(['profesor']), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        const [usuarios, total] = await Promise.all([
            Usuario.find().select('-password').limit(limit).skip((page - 1) * limit),
            Usuario.countDocuments()
        ]);

        res.json({ usuarios, totalPages: Math.ceil(total / limit), currentPage: page });
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Actualizar usuario por ID
router.put('/:_id', autenticarToken, verificarRol(['profesor']), [
    check('nombre').optional().notEmpty().withMessage('El nombre es obligatorio'),
    check('email').optional().isEmail().withMessage('Debe ser un email válido'),
    check('password').optional().isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
        const { _id } = req.params;
        if (req.body.password) req.body.password = await bcrypt.hash(req.body.password, 10);

        const usuarioActualizado = await Usuario.findByIdAndUpdate(_id, req.body, { new: true }).select('-password');
        if (!usuarioActualizado) return res.status(404).json({ error: 'Usuario no encontrado' });

        res.json(usuarioActualizado);
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Eliminar usuario por ID
router.delete('/:_id', autenticarToken, verificarRol(['profesor']), async (req, res) => {
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params._id);
        if (!usuarioEliminado) return res.status(404).json({ error: 'Usuario no encontrado' });

        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

module.exports = router;
