// Importación de módulos necesarios
const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
require('dotenv').config();
const cors = require('cors'); // Middleware para permitir solicitudes de otros orígenes

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Inicialización de la aplicación Express
const app = express();

// Middleware para servir archivos estáticos (frontend)
app.use(express.static(path.join(__dirname, '../frontend')));

// Middleware para permitir solicitudes desde otros dominios (evita problemas con CORS)
app.use(cors());

// Middleware para parsear JSON en el cuerpo de las solicitudes
app.use(express.json());

// Importación y uso de rutas para la gestión de usuarios
const usuarioRoutes = require('./routes/usuario'); // Importar rutas definidas en usuario.js
app.use('/api/usuarios', usuarioRoutes); // Todas las rutas de usuario estarán bajo el prefijo /api/usuarios

// Ruta base para verificar si el servidor está en funcionamiento
app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

// Función para conectar a la base de datos con manejo de diferentes entornos
const connectDB = async () => {
    try {
        // Determinar qué URI de MongoDB usar según el entorno (test o producción)
        const mongoURI = process.env.NODE_ENV === 'test' 
            ? process.env.MONGO_URI_TEST 
            : process.env.MONGO_URI;

        // Establecer conexión a MongoDB con las opciones recomendadas
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Conexión a MongoDB exitosa'); // Mensaje si la conexión es exitosa
    } catch (err) {
        console.error('Error al conectar a MongoDB:', err); // Captura de errores en la conexión
        process.exit(1); // Terminar el proceso si hay error de conexión
    }
};

// Conectar a la base de datos solo si no estamos en modo test
// Esto evita conexiones duplicadas durante las pruebas
if (process.env.NODE_ENV !== 'test') {
    connectDB();
}

// Definir el puerto de la aplicación (usa el de entorno o el 4003 por defecto)
const PORT = process.env.PORT || 4003;

// Iniciar el servidor solo si no estamos en modo test
// Esto evita que el servidor se inicie durante las pruebas
if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en el puerto ${PORT}`);
    });
}

// Exportar app y connectDB para permitir su uso en las pruebas
module.exports = { app, connectDB };
