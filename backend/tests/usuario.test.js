require('dotenv').config();

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../index');
const Usuario = require('../models/Usuario');

let mongoServer;

// Configuración antes de ejecutar pruebas
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    if (mongoose.connection.readyState !== 0) {
        await mongoose.disconnect();
    }

    await mongoose.connect(mongoUri);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1 segundo para asegurarse de que el servidor esté listo
});

// Limpiar la base de datos antes de cada prueba
beforeEach(async () => {
    await Usuario.deleteMany();
});

// Cerrar la conexión después de todas las pruebas
afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

// *Prueba 1: Registro de usuario*
describe('Registro de usuarios', () => {
    test('Debe registrar un usuario con éxito', async () => {
        const res = await request(app)
            .post('/api/usuarios/register')
            .send({
                nombre: 'Juan Pérez',
                email: 'juan@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
    });
});

// *Prueba 2: Obtener usuarios con paginación*
describe('Obtener usuarios con paginación', () => {
    test('Debe devolver usuarios paginados correctamente', async () => {
        await Usuario.insertMany([
            { nombre: 'Usuario 1', email: 'user1@example.com', password: 'password123' },
            { nombre: 'Usuario 2', email: 'user2@example.com', password: 'password123' },
            { nombre: 'Usuario 3', email: 'user3@example.com', password: 'password123' },
        ]);

        const token = await generarTokenUsuario();

        const res = await request(app)
            .get('/api/usuarios/all?page=1&limit=2')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('usuarios');
        expect(Array.isArray(res.body.usuarios)).toBe(true);
        expect(res.body.usuarios.length).toBeLessThanOrEqual(2);
        expect(res.body).toHaveProperty('totalUsuarios');
        expect(res.body).toHaveProperty('totalPages');
    });
});

// *Funciones auxiliares para generar tokens*
async function generarTokenUsuario() {
    const usuario = await Usuario.create({
        nombre: 'Usuario de prueba',
        email: 'prueba@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'usuario'
    });

    return jwt.sign(
        { id: usuario._id, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
}

module.exports = { generarTokenUsuario };
