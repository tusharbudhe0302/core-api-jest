/* eslint-disable quote-props */
const mongoose = require('mongoose');
const uuid = require('uuid');
// Load model
require('./foo');

const {
    Foo: FooModel
} = mongoose.models;

// eslint-disable-next-line jest/no-focused-tests
describe.only('Verify Foo Model', () => {
    let tempId;
    beforeAll(async () => {
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
    it('should insert a valid new document', async () => {
        const validFoo = new FooModel({
            _id: uuid.v1(),
            name: 'Tushar'
        });
        const savedFoo = await validFoo.save();
        // eslint-disable-next-line no-underscore-dangle
        expect(savedFoo._id).toBeDefined();
        expect(savedFoo.created).toBeDefined();
        expect(savedFoo.modified).toBeDefined();
    });
    it('should find a valid document', async () => {
        const findFoos = await FooModel.find({});

        expect(findFoos.length).toBeDefined();
    });
    it('should insert a valid new document with data', async () => {
        const validFooDataObject = new FooModel({
            _id: uuid.v1(),
            name: 'Tushar',
            data: {
                foo: 'bar'
            }
        });
        const savedFoo = await validFooDataObject.save();
        // eslint-disable-next-line no-underscore-dangle
        tempId = savedFoo._id;
        expect(savedFoo.id).toBeDefined();
        expect(savedFoo.name).toBe('Tushar');
        // eslint-disable-next-line quotes
        expect(savedFoo.data).toEqual({
            'foo': 'bar'
        });
    });
    // eslint-disable-next-line jest/no-disabled-tests
    it('should insert a valid new document with list of foos id`s', async () => {
        const guidArray = [];
        for (let i = 0; i < 3; i++) {
            guidArray.push(uuid.v4());
        }
        const validFoo = new FooModel({
            _id: uuid.v1(),
            name: 'Tushar',
            data: {
                foo: 'bar'
            },
            foos: guidArray
        });
        const savedFoo = await validFoo.save();
        tempId = savedFoo.id;
        expect(savedFoo.id).toBeDefined();
        expect(savedFoo.name).toBe('Tushar');
        expect(savedFoo.data).toEqual({
            'foo': 'bar'
        });
        expect(new Set(savedFoo.foos)).toEqual(new Set(guidArray));
    });
    it('should find a valid document by id', async () => {
        const findFoos = await FooModel.findById(tempId);

        expect(findFoos).not.toBe(null);
        expect(findFoos.name).toBe('Tushar');
    });
    it('should update a valid document by id', async () => {
        const updateFoos = await FooModel.findOneAndUpdate({
            _id: tempId
        }, {
            name: 'Tushar Update',
            data: {
                foo: 'bar'
            }
        }, {
            new: true,
            runValidators: true
        });

        expect(updateFoos).not.toBe(null);
        expect(updateFoos.name).toStrictEqual('Tushar Update');
    });
});
