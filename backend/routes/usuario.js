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
        
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const role = email === 'admin@escuela.com' ? 'admin' : 'usuario';

        const nuevoUsuario = new Usuario({ nombre, email, password: hashedPassword, role });

        const usuarioGuardado = await nuevoUsuario.save();
        
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
        res.status(500).json({ error: err.message });
    }
});

// *Iniciar sesión con validación de datos*
router.post('/login', validarLogin, async (req, res) => {
    try {
        const usuario = await Usuario.findOne({ email: req.body.email });
        if (!usuario) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const validPassword = await bcrypt.compare(req.body.password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

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
        res.status(500).json({ error: err.message });
    }
});

// *Obtener todos los usuarios (solo accesible para admin)*
router.get('/all', autenticarToken, async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('-password');
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// *Actualizar un usuario por ID*
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

// *Eliminar un usuario (solo accesible para admin)*
router.delete('/:_id', autenticarToken, verificarAdmin, async (req, res) => { 
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

// *Obtener usuarios con paginación*
router.get('/all', autenticarToken, async (req, res) => {
    try {
        // Parámetros opcionales para paginación (por defecto, página 1 y 10 usuarios por página)
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        // Calculamos el número de usuarios a omitir según la página
        const skip = (page - 1) * limit;

        // Obtener usuarios con paginación (excluyendo las contraseñas)
        const usuarios = await Usuario.find()
            .select('-password')
            .skip(skip)
            .limit(limit);

        // Contar el total de usuarios en la base de datos
        const totalUsuarios = await Usuario.countDocuments();

        // Calcular el número total de páginas
        const totalPages = Math.ceil(totalUsuarios / limit);

        res.json({
            totalUsuarios,
            totalPages,
            currentPage: page,
            usersPerPage: limit,
            usuarios
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
module.exports = router;