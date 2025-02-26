const request = require('supertest');
const { app, server } = require('../index');
const mongoose = require('mongoose');
const Usuario = require('../models/Usuario');

beforeAll(async () => {
    await mongoose.disconnect();
    await mongoose.connect(process.env.MONGO_URI_TEST, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

afterAll(async () => {
    await mongoose.connection.close();
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
        token = res.body.token;
    });

    test('Debe obtener todos los usuarios', async () => {
        const res = await request(app)
            .get('/api/usuarios/all')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('usuarios');
    });
});