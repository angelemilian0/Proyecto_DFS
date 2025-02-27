const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../index');
const Usuario = require('../models/Usuario');

let mongoServer;

// Configuración antes de ejecutar pruebas
// Antes de ejecutar las pruebas, iniciamos MongoDB en memoria
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // **Evitamos múltiples conexiones**
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    }
});

// Después de ejecutar las pruebas, cerramos la BD en memoria correctamente
afterAll(async () => {
    await mongoose.connection.close();
    await mongoServer.stop();
});

// **Corrección en las pruebas**
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

// **Prueba 2: Obtener usuarios con paginación**
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
            .set('Authorization', `Bearer ${token}`);  // 🔹 Revisión de sintaxis aquí

        expect(res.statusCode).toBe(200);
        expect(res.body.usuarios.length).toBe(2);
        expect(res.body).toHaveProperty('totalUsuarios');
        expect(res.body).toHaveProperty('totalPages');
    });
});

// **Prueba 3: Eliminar usuario (Solo admin)**
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

        const token = await generarToken(admin);

        const res = await request(app)
            .delete(`/api/usuarios/${usuario._id}`)  // 🔹 Revisión de sintaxis aquí
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(204);
    });

    test('Debe rechazar la eliminación si no es admin', async () => {
        const usuario = await Usuario.create({
            nombre: 'Test User',
            email: 'test@example.com',
            password: await bcrypt.hash('password123', 10),
            role: 'usuario'
        });

        const token = await generarTokenUsuario();

        const res = await request(app)
            .delete(`/api/usuarios/${usuario._id}`)  // 🔹 Revisión de sintaxis aquí
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(403);
        expect(res.body.error).toBe('Acceso restringido a administradores');
    });
});

// **Funciones auxiliares corregidas para generar tokens**
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
