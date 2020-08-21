/* eslint-disable linebreak-style */
/* eslint-disable jest/no-test-callback */
const express = require('express');
const supertest = require('supertest');
const uuid = require('uuid');
const mongoose = require('mongoose');

// Load model
require('../models/foo');

const { Foo: FooModel } = mongoose.models;
const router = require('../index');

// eslint-disable-next-line jest/no-disabled-tests
// eslint-disable-next-line jest/valid-describe
describe('Verify Foo Endpoint', () => {
    let request;
    let guid;
    let tempId;
    beforeAll(async () => {
        const app = express();
        app.use(router);
        request = supertest(app);
        // eslint-disable-next-line no-unused-vars
        guid = uuid.v4();
        await mongoose.connect(
            process.env.MONGO_URL, {
                useFindAndModify: false,
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useCreateIndex: true
            }
        );
    });
    afterAll(async () => {
        await mongoose.connection.close();
    });
    it('Should respond to POST - /foos/foo', async (done) => {
        const mockFooRequest = {
            name: 'Tushar 99',
            data: {
                foo: 'bar'
            }
        };
        const response = await request.post('/foos/foo').set('Content-Type', 'application/json').send(mockFooRequest);
        // eslint-disable-next-line no-underscore-dangle
        tempId = await response.body.data._id;
        expect(response.status).toStrictEqual(201);
        expect(response.body.error).toStrictEqual(null);
        expect(response.body.data).not.toBe(null);
        expect(response.body.data).toHaveProperty('_id');
        expect(response.body.data).toHaveProperty('name');
        done();
    });
    it('Should respond to again POST - /foos/foo ', async (done) => {
        const mockFooRequest = {
            name: 'Tushar 100',
            data: {
                foo: 'bar'
            },
            foos: [tempId]
        };
        const response = await request.post('/foos/foo').set('Content-Type', 'application/json').send(mockFooRequest);
        // eslint-disable-next-line no-underscore-dangle
        tempId = await response.body.data._id;
        expect(response.status).toStrictEqual(201);
        expect(response.body.error).toStrictEqual(null);
        expect(response.body.data).not.toBe(null);
        expect(response.body.data).toHaveProperty('_id');
        expect(response.body.data).toHaveProperty('name');
        done();
    });
    it('Should respond to GET - /foos/foo/:id', async (done) => {
        const response = await request.get(`/foos/foo/${tempId}`);
        expect(response.status).toStrictEqual(200);
        expect(response.body.error).toStrictEqual(null);
        expect(response.body.data).not.toBe(null);
        // eslint-disable-next-line no-underscore-dangle
        expect(response.body.data._id).toStrictEqual(tempId);
        done();
    });
    it('Should respond to PUT - /foos/foo/:id', async (done) => {
        const mockFooRequestUpdate = {
            name: 'Tushar Update',
            data: {
                foo: 'bar'
            }
        };
        const responseUpdate = await request.put(`/foos/foo/${tempId}`).set('Content-Type', 'application/json').send(mockFooRequestUpdate);
        expect(responseUpdate.status).toStrictEqual(200);
        expect(responseUpdate.body.error).toStrictEqual(null);
        expect(responseUpdate.body.data).not.toBe(null);
        expect(responseUpdate.body.data).toHaveProperty('name');
        expect(responseUpdate.body.data.name).toStrictEqual('Tushar Update');
        done();
    });
    it('Should respond to GET - /foos', async (done) => {
        const response = await request.get('/foos');
        expect(response.status).toStrictEqual(200);
        expect(response.body.error).toStrictEqual(null);
        expect(response.body.data.length).toBeGreaterThan(0);
        done();
    });
    it('Should respond to DELETE - /foos/foo/:id', async (done) => {
        const responseUpdate = await request.delete(`/foos/foo/${tempId}`);
        expect(responseUpdate.status).toStrictEqual(200);
        expect(responseUpdate.body.error).toStrictEqual(null);
        expect(responseUpdate.body.data).not.toBe(null);
        expect(responseUpdate.body.data).toHaveProperty('name');
        expect(responseUpdate.body.data.name).toStrictEqual('Tushar Update');
        done();
    });
    it('Should respond to PUT foo by id Not Found - /foos/foo/:id', async (done) => {
        const mockFooRequestUpdate = {
            name: 'Tushar Update',
            data: {
                foo: 'bar'
            }
        };
        const responseUpdate = await request.put(`/foos/foo/${tempId}`).set('Content-Type', 'application/json').send(mockFooRequestUpdate);
        expect(responseUpdate.status).toStrictEqual(404);
        expect(responseUpdate.body.error).not.toBe(null);
        expect(responseUpdate.body.data).toStrictEqual(null);
        done();
    });
    it('Should respond to GET foo by id Not Found - /foos/foo/:id', async (done) => {
        const response = await request.get(`/foos/foo/${tempId}`);
        expect(response.status).toStrictEqual(404);
        expect(response.body.error).toStrictEqual('Not Found!');
        expect(response.body.data).toBe(null);
        done();
    });
    it('Should respond to DELETE foo by id Not Found - /foos/foo/:id', async (done) => {
        const responseDelete = await request.delete(`/foos/foo/${tempId}`);
        expect(responseDelete.status).toStrictEqual(404);
        expect(responseDelete.body.error).not.toBe(null);
        expect(responseDelete.body.error).toStrictEqual('Not Found!');
        expect(responseDelete.body.data).toBe(null);
        done();
    });
    it('Should respond to POST foo Bad Request - /foos/foo', async (done) => {
        const mockFooBadRequest = {
            name: 'T',
            data: {
                foo: 'bar'
            },
            foos: []
        };
        const responseBadRequest = await request.post('/foos/foo').set('Content-Type', 'application/json').send(mockFooBadRequest);
        expect(responseBadRequest.status).toStrictEqual(400);
        expect(responseBadRequest.body.error).not.toBe(null);
        expect(responseBadRequest.body.data).toStrictEqual(null);
        done();
    });
    it('Should respond to PUT foo Bad Request - /foos/foo/:id', async (done) => {
        const mockFooBadRequest = {
            name: 'T',
            data: {
                foo: 'bar'
            },
            foos: []
        };
        const responseBadRequest = await request.put(`/foos/foo/${tempId}`).set('Content-Type', 'application/json').send(mockFooBadRequest);
        expect(responseBadRequest.status).toStrictEqual(400);
        expect(responseBadRequest.body.error).not.toBe(null);
        expect(responseBadRequest.body.data).toStrictEqual(null);
        done();
    });
    it('Should respond to GET foos Not Found - /foos', async (done) => {
        await FooModel.deleteMany({});
        const response = await request.get('/foos');
        expect(response.status).toStrictEqual(404);
        expect(response.body.error).toStrictEqual('Not Found!');
        done();
    });
    it('Should respond to GET foo by id Bad Request - /foos/foo/a-z-1-9', async (done) => {
        const response = await request.get('/foos/foo/a-z-1-9');
        expect(response.status).toStrictEqual(400);
        expect(response.body.error).not.toBe(null);
        done();
    });
});
describe('Foo Endpoint Server 500 Error', () => {
    // let request;
    let guid;
    beforeAll(async () => {
        const app = express();
        app.use(router);
        // request = supertest(app);
        // eslint-disable-next-line no-unused-vars
        guid = uuid.v4();
        await mongoose.connect(
            process.env.MONGO_URL, {
                useUnifiedTopology: true,
                useNewUrlParser: true,
                useCreateIndex: true
            }
        );
    });
    afterAll(async () => {
        await mongoose.connection.close();
    });
});
