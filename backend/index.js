const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Conexión a MongoDB
const connectDB = async () => {
    try {
        if (mongoose.connections[0].readyState) {
            return;
        }
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            ssl: true,
        });
        console.log('Conexión a MongoDB exitosa');
    } catch (err) {
        console.error('Error al conectar a MongoDB:', err);
        throw err;
    }
};

// Asegurarnos de que la conexión se establezca
connectDB();

// Rutas
const usuarioRoutes = require('./routes/usuario');
app.use('/api/usuarios', usuarioRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API funcionando correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        message: err.message 
    });
});

// No es necesario app.listen() en Vercel
module.exports = app;