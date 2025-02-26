require('dotenv').config();
const request = require('supertest');
const { app, server } = require('../index');
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');

beforeAll(async () => {
    // Cerrar conexión previa si existe
    if (mongoose.connection.readyState === 1) {
        await mongoose.connection.close();
    }

    // Conectar a la base de datos de prueba
    await mongoose.connect(process.env.MONGO_URI_TEST);
});

afterAll(async () => {
    await mongoose.connection.close();
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Espera para cierre completo
    server.close();
});

describe('Pruebas de rutas de usuario', () => {
    let token;

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/usuarios/register')
            .send({
                nombre: 'Test User',
                email: 'testuser@example.com',
                password: 'password123',
                role: 'profesor'
            });

        expect(res.statusCode).toBe(201); // Asegura que el usuario se creó correctamente
        token = res.body.token;
    });

    test('Debe obtener todos los usuarios', async () => {
        const res = await request(app)
            .get('/api/usuarios/all')
            .set('Authorization', `Bearer ${token}`);

        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('usuarios');
    });
});
