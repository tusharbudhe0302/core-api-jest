const express = require('express');
const supertest = require('supertest');
const router = require('../index');

describe('Verify Root Endpoint', () => {
    let request;

    beforeAll(() => {
        const app = express();
        app.use(router);

        request = supertest(app);
    });

    it('Should respond to GET - /', async () => {
        const response = await request.get('/');

        expect(response.status).toStrictEqual(200);
        expect(response.body.data).toBe('OK');
    });

    it('Should respond to bad request - /err', async () => {
        const response = await request.get('/err');
        expect(response.status).toStrictEqual(500);
        expect(response.body.data).toStrictEqual(null);
        expect(response.body.error).toStrictEqual('DOH!');
    });
});
