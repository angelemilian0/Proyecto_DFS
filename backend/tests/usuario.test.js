const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index'); // Asegúrate de que apunta al archivo correcto de la app
require('dotenv').config();

beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI_TEST, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }
});

afterAll(async () => {
    await mongoose.disconnect();
});

describe('Pruebas de rutas de usuario', () => {
    let token = '';

    test('Debe registrar un usuario', async () => {
        const res = await request(app)
            .post('/api/usuarios/register')
            .send({
                nombre: 'Test User',
                email: 'testuser@example.com',
                password: 'password123',
                role: 'profesor'
            });

        console.log('Respuesta del servidor:', res.body); // 🔍 Depuración

        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('token');
        token = res.body.token;
    });

    test('Debe obtener todos los usuarios', async () => {
        const res = await request(app)
            .get('/api/usuarios')
            .set('Authorization', `Bearer ${token}`);

        console.log('Usuarios obtenidos:', res.body); // 🔍 Depuración

        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});
