const express = require('express');
const Usuario = require('../models/Usuario');  
const bcrypt = require('bcrypt');  
const jwt = require('jsonwebtoken');  
const { autenticarToken, verificarAdmin } = require('../middlewares/autenticarToken');  
const { validarRegistro, validarLogin } = require('../middlewares/validarDatos');  

const router = express.Router();

// *Registrar un nuevo usuario con validación de datos*
router.post('/register', validarRegistro, async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        // ✅ Si el usuario ya existe, devolver error
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Hash de la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // ✅ "profesor@gmail.com" siempre será admin
        const role = email === 'profesor@gmail.com' ? 'admin' : 'usuario';

        // Crear nuevo usuario
        const nuevoUsuario = new Usuario({ nombre, email, password: hashedPassword, role });
        const usuarioGuardado = await nuevoUsuario.save();

        // Generar Token
        const token = jwt.sign(
            { id: usuarioGuardado._id, role: usuarioGuardado.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.status(201).json({
            id: usuarioGuardado._id,
            nombre: usuarioGuardado.nombre,
            email: usuarioGuardado.email,
            role: usuarioGuardado.role,
            token
        });
    } catch (err) {
        console.error("Error al registrar usuario:", err);
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// *Iniciar sesión con validación de datos*
router.post('/login', validarLogin, async (req, res) => {
    try {
        const usuario = await Usuario.findOne({ email: req.body.email });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Comparar contraseña
        const validPassword = await bcrypt.compare(req.body.password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        // Generar Token
        const token = jwt.sign(
            { id: usuario._id, role: usuario.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            role: usuario.role,
            token
        });
    } catch (err) {
        console.error("Error en login:", err);
        res.status(500).json({ error: 'Error en el inicio de sesión' });
    }
});

// *Obtener usuarios con paginación (Solo Admin)*
router.get('/all', autenticarToken, verificarAdmin, async (req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const usuarios = await Usuario.find()
            .select('-password')
            .skip(skip)
            .limit(limit);

        const totalUsuarios = await Usuario.countDocuments();
        const totalPages = Math.ceil(totalUsuarios / limit);

        res.json({
            totalUsuarios,
            totalPages,
            currentPage: page,
            usersPerPage: limit,
            usuarios
        });
    } catch (err) {
        console.error("Error al obtener usuarios:", err);
        res.status(500).json({ error: 'Error al obtener usuarios' });
    }
});

// *Actualizar un usuario por ID (Solo Admin)*
router.put('/:_id', autenticarToken, verificarAdmin, async (req, res) => {
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
        console.error("Error al actualizar usuario:", err);
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

// *Eliminar un usuario (Solo Admin)*
router.delete('/:_id', autenticarToken, verificarAdmin, async (req, res) => { 
    try {
        console.log(req.params._id);
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params._id);
        if (!usuarioEliminado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(204).send();
    } catch (err) {
        console.error("Error al eliminar usuario:", err);
        res.status(500).json({ error: 'Error al eliminar usuario' });
    }
});

module.exports = router;
