const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

app.use(cors({
    origin: '*'
}));
app.use(express.json());

// 🔹 Servir archivos estáticos correctamente
app.use(express.static(path.join(__dirname, '../frontend')));
app.use('/logic', express.static(path.join(__dirname, '../frontend/logic')));
app.use('/images', express.static(path.join(__dirname, '../frontend/images')));
app.use('/styles', express.static(path.join(__dirname, '../frontend')));

// 🔹 Forzar que la página inicial sea `login.html`
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

// 🔹 Redirigir `/index.html` a `login.html`
app.get('/index.html', (req, res) => {
    res.redirect('/');
});

// 🔹 Rutas de la API
const usuarioRoutes = require('./routes/usuario');
app.use('/api/usuarios', usuarioRoutes);

const climaRoutes = require('./routes/clima');
app.use('/api/clima', climaRoutes);

// 🔹 Ruta para verificar el estado de la API
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API funcionando correctamente' });
});

// 🔹 Manejo de errores
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        message: err.message 
    });
});

// 🔹 Iniciar el servidor
const PORT = process.env.PORT || 4003;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;
