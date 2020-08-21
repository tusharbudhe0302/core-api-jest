const mongoose = require('mongoose');
const uuid = require('uuid');

const fooSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: uuid.v1
    },
    name: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        default: null
    },
    foos: {
        type: Array,
        default: []
    }
},
{
    timestamps: {
        createdAt: 'created',
        updatedAt: 'modified'
    },
    versionKey: false
});

module.exports.foos = mongoose.model('Foo', fooSchema);
