const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('.');

describe('Verify Endpoints', () => {
    let request;

    beforeAll(async (done) => {
        await mongoose.connect(
            process.env.MONGO_URL,
            {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useCreateIndex: true
            }
        );

        request = supertest(app);
        done();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('With Root GET - /', () => {
        it('Should respond to GET', async () => {
            const response = await request.get('/');

            expect(response.status).toStrictEqual(200);
            expect(response.body.data).toStrictEqual('OK');
            expect(response.body.error).toStrictEqual(null);
        });
    });

    describe('With Bad Endpoints POST - /bar', () => {
        it('Should respond to unmatched path', async () => {
            const response = await request.post('/bar');

            expect(response.body.data).toBe(null);
            expect(response.body.error).toStrictEqual('Not Found!');
        });

        it('Should respond to bad request GET - /err', async () => {
            const response = await request.get('/err');

            expect(response.status).toStrictEqual(500);
            expect(response.body.error).toStrictEqual('DOH!');
            expect(response.body.data).toBe(null);
        });
    });
});
