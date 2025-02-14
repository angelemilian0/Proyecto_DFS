const request = require('supertest');
const mongoose = require('mongoose');
const { app, connectDB } = require('../backend/index');
const Usuario = require('../backend/models/Usuario');

beforeAll(async () => {
    process.env.NODE_ENV = 'test';
    await connectDB();
});

describe('API de Usuarios', () => {
    beforeAll(async () => {
        // Conectar a la base de datos de prueba
        await mongoose.connect(process.env.MONGO_URI_TEST || 'mongodb://localhost:27017/test_db');
    });

    // Limpiar la base de datos después de cada prueba
    afterEach(async () => {
        await Usuario.deleteMany({});
    });

    // Cerrar la conexión después de todas las pruebas
    afterAll(async () => {
        await mongoose.connection.close();
    });

    // Prueba de registro
    describe('POST /api/usuarios/register', () => {
        test('debería registrar un nuevo usuario', async () => {
            const res = await request(app)
                .post('/api/usuarios/register')
                .send({
                    nombre: 'Usuario Test',
                    email: 'test@test.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('token');
            expect(res.body.nombre).toBe('Usuario Test');
            expect(res.body.email).toBe('test@test.com');
        });

        test('no debería registrar un usuario con email duplicado', async () => {
            // Primero creamos un usuario
            await request(app)
                .post('/api/usuarios/register')
                .send({
                    nombre: 'Usuario 1',
                    email: 'test@test.com',
                    password: 'password123'
                });

            // Intentamos crear otro usuario con el mismo email
            const res = await request(app)
                .post('/api/usuarios/register')
                .send({
                    nombre: 'Usuario 2',
                    email: 'test@test.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('error', 'El email ya está registrado');
        });
    });

    // Prueba de login
    describe('POST /api/usuarios/login', () => {
        test('debería hacer login correctamente', async () => {
            // Primero registramos un usuario
            await request(app)
                .post('/api/usuarios/register')
                .send({
                    nombre: 'Usuario Login',
                    email: 'login@test.com',
                    password: 'password123'
                });

            // Intentamos hacer login
            const res = await request(app)
                .post('/api/usuarios/login')
                .send({
                    email: 'login@test.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('token');
        });

        test('no debería hacer login con credenciales incorrectas', async () => {
            const res = await request(app)
                .post('/api/usuarios/login')
                .send({
                    email: 'noexiste@test.com',
                    password: 'password123'
                });

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('error', 'Usuario no encontrado');
        });
    });
});
