// Importamos los módulos necesarios
const express = require('express');
const Usuario = require('../models/Usuario'); // Modelo de usuario
const bcrypt = require('bcrypt'); // Librería para el hash de contraseñas
const jwt = require('jsonwebtoken'); // Librería para generar tokens JWT
const router = express.Router(); // Inicializamos el router de Express

// Ruta para registrar un nuevo usuario
router.post('/register', async (req, res) => {
    try {
        // Verificamos si el email ya está registrado
        const usuarioExistente = await Usuario.findOne({ email: req.body.email });
        if (usuarioExistente) {
            return res.status(400).json({ error: 'El email ya está registrado' });
        }

        // Generamos un salt y encriptamos la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Creamos el nuevo usuario con los datos proporcionados
        const nuevoUsuario = new Usuario({
            nombre: req.body.nombre,
            email: req.body.email,
            password: hashedPassword
        });

        // Guardamos el usuario en la base de datos
        const usuarioGuardado = await nuevoUsuario.save();
        
        // Generamos un token JWT con el ID del usuario y una duración de 1 hora
        const token = jwt.sign(
            { id: usuarioGuardado._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Respondemos con los datos del usuario y el token
        res.status(201).json({
            id: usuarioGuardado._id,
            nombre: usuarioGuardado.nombre,
            email: usuarioGuardado.email,
            token
        });
    } catch (err) {
        console.error('Error al registrar usuario:', err);
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
            { id: usuario._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        // Respondemos con los datos del usuario y el token
        res.json({
            id: usuario._id,
            nombre: usuario.nombre,
            email: usuario.email,
            token
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para obtener todos los usuarios (sin incluir sus contraseñas)
router.get('/', async (req, res) => {
    try {
        const usuarios = await Usuario.find().select('-password');
        res.json(usuarios);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para actualizar un usuario por su ID
router.put('/:_id', async (req, res) => {
    try {
        // Si se proporciona una nueva contraseña, la encriptamos antes de actualizar
        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password, salt);
        }

        // Buscamos y actualizamos el usuario por su ID
        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.params._id,  
            req.body,
            { new: true }
        ).select('-password'); // Excluimos la contraseña en la respuesta
        
        if (!usuarioActualizado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(usuarioActualizado);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Ruta para eliminar un usuario por su ID
router.delete('/:_id', async (req, res) => { 
    try {
        const usuarioEliminado = await Usuario.findByIdAndDelete(req.params._id);
        if (!usuarioEliminado) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(204).send(); // Enviamos una respuesta sin contenido (eliminación exitosa)
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Exportamos el router para que pueda ser utilizado en la aplicación
module.exports = router;
