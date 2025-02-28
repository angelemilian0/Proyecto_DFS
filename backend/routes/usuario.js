const express = require('express');
const Usuario = require('../models/Usuario');  
const bcrypt = require('bcrypt');  
const jwt = require('jsonwebtoken');  
const { autenticarToken, verificarAdmin } = require('../middlewares/autenticarToken');  
const { validarRegistro, validarLogin } = require('../middlewares/validarDatos');  

const router = express.Router();

// *Registrar un nuevo usuario*
router.post('/register', validarRegistro, async (req, res) => {
    try {
        const { nombre, email, password } = req.body;

        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const role = email === 'profesor@gmail.com' ? 'admin' : 'usuario';

        const nuevoUsuario = new Usuario({ nombre, email, password: hashedPassword, role });
        const usuarioGuardado = await nuevoUsuario.save();

        res.status(201).json(usuarioGuardado);
    } catch (err) {
        res.status(500).json({ error: 'Error al registrar usuario' });
    }
});

// *Actualizar un usuario por ID (Solo Admin)*
router.put('/:_id', autenticarToken, verificarAdmin, async (req, res) => {
    try {
        if (req.body.password) {
            req.body.password = await bcrypt.hash(req.body.password, 10);
        }

        const usuarioActualizado = await Usuario.findByIdAndUpdate(req.params._id, req.body, { new: true })
            .select('-password');

        if (!usuarioActualizado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(usuarioActualizado);
    } catch (err) {
        res.status(500).json({ error: 'Error al actualizar usuario' });
    }
});

module.exports = router;
