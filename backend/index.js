require('dotenv').config(); // 🔹 Asegurar que se carga el .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Conexión a MongoDB
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log('MongoDB ya está conectado.');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conexión a MongoDB exitosa');
    } catch (err) {
        console.error('Error al conectar a MongoDB:', err);
        throw err;
    }
};

connectDB();

// Rutas
const usuarioRoutes = require('./routes/usuario');
app.use('/api/usuarios', usuarioRoutes);
const climaRoutes = require('./routes/clima');
app.use('/api/clima', climaRoutes);


// Iniciar el servidor solo si no es entorno de prueba
const PORT = process.env.PORT || 4003;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
}

// Servir archivos estáticos desde la carpeta frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Ruta por defecto para servir el archivo HTML principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

module.exports = app;