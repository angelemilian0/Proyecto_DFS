require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const Usuario = require('./models/Usuario'); // Importar modelo de usuario

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Conexión a MongoDB
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        console.log('✅ MongoDB ya está conectado.');
        return;
    }

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('✅ Conexión a MongoDB exitosa.');
    } catch (err) {
        console.error('❌ Error al conectar a MongoDB:', err);
        throw err;
    }
};

// 🔹 Función para crear automáticamente el usuario profesor
const crearUsuarioAdmin = async () => {
    const emailAdmin = "profesor@gmail.com";
    const passwordAdmin = "profesor";

    try {
        const usuarioExistente = await Usuario.findOne({ email: emailAdmin });

        if (!usuarioExistente) {
            console.log("🔍 Usuario profesor no encontrado. Creando usuario...");

            const hashedPassword = await bcrypt.hash(passwordAdmin, 10);
            const nuevoUsuario = new Usuario({
                nombre: "Profesor",
                email: emailAdmin,
                password: hashedPassword,
                role: "admin"
            });

            await nuevoUsuario.save();
            console.log("✅ Usuario profesor creado correctamente en MongoDB.");
        } else {
            console.log("✅ Usuario profesor ya existe en MongoDB. No es necesario crearlo.");
        }
    } catch (error) {
        console.error("❌ Error al crear usuario admin:", error);
    }
};

// Ejecutar la conexión a la BD y luego crear el usuario profesor
connectDB().then(crearUsuarioAdmin);

// 🔹 Servir archivos estáticos correctamente
app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.use('/logic', express.static(path.join(__dirname, '..', 'frontend', 'logic')));
app.use('/images', express.static(path.join(__dirname, '..', 'frontend', 'images')));
app.use('/styles', express.static(path.join(__dirname, '..', 'frontend')));

// Rutas de la API
const usuarioRoutes = require('./routes/usuario');
app.use('/api/usuarios', usuarioRoutes);
const climaRoutes = require('./routes/clima');
app.use('/api/clima', climaRoutes);

// Ruta principal que sirve el archivo HTML de inicio (login.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'login.html'));
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ 
        error: 'Error interno del servidor',
        message: err.message 
    });
});

// Iniciar el servidor solo si no es entorno de prueba
const PORT = process.env.PORT || 4003;
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
}

module.exports = app;
