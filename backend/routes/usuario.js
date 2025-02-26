// Importamos los módulos necesarios
const express = require('express');
const { autenticarToken, verificarRol } = require('../middlewares/autenticarToken');
const { body, validationResult } = require('express-validator');
const Usuario = require('../models/Usuario'); // Modelo de usuario
const bcrypt = require('bcrypt'); // Librería para el hash de contraseñas
const jwt = require('jsonwebtoken'); // Librería para generar tokens JWT
const router = express.Router(); // Inicializamos el router de Express

// Ruta para registrar un nuevo usuario
router.post('/register', [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Email inválido'),
    body('password').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
], async (req, res) => {
    const errores = validationResult(req);
    if (!errores.isEmpty()) {
        return res.status(400).json({ errores: errores.array() });
    }

    try {
        const usuarioExistente = await Usuario.findOne({ email: req.body.email });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const nuevoUsuario = new Usuario(req.body);
        const usuarioGuardado = await nuevoUsuario.save();
        res.status(201).json(usuarioGuardado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para iniciar sesión
router.post('/login', async (req, res) => {
    try {
        // Buscamos al usuario por su email
        const usuario = await Usuario.findOne({ email: req.body.email });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Comparamos la contraseña ingresada con la almacenada en la base de datos
        const validPassword = await bcrypt.compare(req.body.password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        // Generamos un token JWT con el ID del usuario
        const token = jwt.sign(
            { id: usuario._id, role: usuario.role }, // Incluimos el rol en el token
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Respondemos con los datos del usuario y el token
        res.json({
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            role: usuario.role, // Incluimos el rol en la respuesta
            token
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para obtener todos los usuarios (sin incluir sus contraseñas)
router.get('/all', autenticarToken, verificarRol(['admin']), async (req, res) => {
    const { page = 1, limit = 10 } = req.query;
    try {
        const usuarios = await Usuario.find()
            .select('-password')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();
        const count = await Usuario.countDocuments();
        res.json({
            usuarios,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para actualizar un usuario por su ID
router.put('/:_id', autenticarToken, async (req, res) => {
    try {
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.params._id,  
            req.body,
            { new: true }
        ).select('-password');
        
        if (!usuarioActualizado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(usuarioActualizado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para eliminar un usuario por su ID
router.delete('/:_id', autenticarToken, verificarRol(['admin']), async (req, res) => { 
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params._id);
        if (!usuarioEliminado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Exportamos el router para que pueda ser utilizado en la aplicación
module.exports = router;
