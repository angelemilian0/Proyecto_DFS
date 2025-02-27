const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt'); // 🔹 Asegurar que bcrypt está importado
const jwt = require('jsonwebtoken'); // 🔹 Asegurar que jwt está importado
const app = require('../index');  // Importamos la aplicación principal
const Usuario = require('../models/Usuario'); // Importamos el modelo

let mongoServer;

// Antes de ejecutar las pruebas, creamos una BD en memoria
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

// Después de ejecutar las pruebas, cerramos la BD en memoria
afterAll(async () => {
    await mongoose.disconnect();
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

    test('Debe rechazar un registro si el email ya está registrado', async () => {
        await Usuario.create({
            nombre: 'María López',
            email: 'maria@example.com',
            password: 'password123',
            role: 'usuario'
        });

        const res = await request(app)
            .post('/api/usuarios/register')
            .send({
                nombre: 'María López',
                email: 'maria@example.com',
                password: 'password123'
            });

        expect(res.statusCode).toBe(400);
        expect(res.body.error).toBe('El email ya está registrado');
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

        const token = await generarTokenUsuario(); // 🔹 Corrección aquí

        const res = await request(app)
            .get('/api/usuarios/all?page=1&limit=2')
            .set('Authorization', Bearer + token);

        expect(res.statusCode).toBe(200);
        expect(res.body.usuarios.length).toBe(2);
        expect(res.body).toHaveProperty('totalUsuarios');
        expect(res.body).toHaveProperty('totalPages');
    });
});

// *Prueba 3: Eliminar usuario (Solo admin)*
describe('Eliminar usuario', () => {
    test('Debe permitir a un admin eliminar un usuario', async () => {
        const admin = await Usuario.create({
            nombre: 'Admin User',
            email: 'admin@example.com',
            password: await bcrypt.hash('password123', 10),
            role: 'admin'
        });

        const usuario = await Usuario.create({
            nombre: 'Test User',
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10),
            role: 'usuario'
        });

        const token = await generarToken(admin); // 🔹 Corrección aquí

        const res = await request(app)
            .delete(/api/usuarios/usuario._id)
            .set('Authorization', Bearer + token);

        expect(res.statusCode).toBe(204);
    });

    test('Debe rechazar la eliminación si no es admin', async () => {
        const usuario = await Usuario.create({
            nombre: 'Test User',
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10),
            role: 'usuario'
        });

        const token = await generarTokenUsuario(); // 🔹 Corrección aquí

        const res = await request(app)
            .delete(/api/usuarios/usuario._id)
            .set('Authorization', Bearer + token);

        expect(res.statusCode).toBe(403);
        expect(res.body.error).toBe('Acceso restringido a administradores');
    });
});

// *🔹 Funciones auxiliares corregidas para generar tokens*
async function generarTokenUsuario() {
    const usuario = await Usuario.create({
        nombre: 'Usuario de prueba',
        email: 'prueba@example.com',
        password: await bcrypt.hash('password123', 10),
        role: 'usuario'
    });

    return jwt.sign(
        { id: usuario._id, role: usuario.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
}

async function generarToken(usuario) {
    return jwt.sign(
        { id: usuario._id, role: usuario.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
}