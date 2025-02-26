const request = require('supertest');
const app = require('../backend/index');

describe('Pruebas de seguridad para rutas protegidas', () => {
    let token;

    beforeAll(async () => {
        const res = await request(app)
            .post('/api/usuarios/login')
            .send({ email: 'profesor@gmail.com', password: 'profesor' });
        token = res.body.token;
    });

    it('Debe denegar acceso sin token', async () => {
        const res = await request(app).get('/api/usuarios/all');
        expect(res.statusCode).toEqual(401);
    });

    it('Debe permitir acceso con token válido', async () => {
        const res = await request(app)
            .get('/api/usuarios/all')
            .set('Authorization', `Bearer ${token}`);
        expect(res.statusCode).toEqual(200);
    });
});
