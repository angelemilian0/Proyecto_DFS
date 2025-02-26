const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { autenticarToken } = require('./middlewares/autenticarToken');
const manejoErrores = require('./middlewares/manejoErrores');

dotenv.config();

const app = express();

app.use(cors({
    origin: '*'
}));
app.use(express.json());

// Conexión a MongoDB
const connectDB = async () => {
    try {
        if (mongoose.connections[0].readyState) {
            return;
        }
        await mongoose.connect(process.env.MONGO_URI, {
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

const usuarioRoutes = require('./routes/usuario');
const apiExternaRoutes = require('./routes/apiExterna');
app.use('/api/usuarios', autenticarToken, usuarioRoutes);
app.use('/api/externa', apiExternaRoutes);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'API funcionando correctamente' });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.use(express.static(path.join(__dirname, '../frontend')));

app.use(manejoErrores);

const PORT = process.env.PORT || 4003;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;