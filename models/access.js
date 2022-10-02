const { Schema, model } = require('mongoose');

const accessSchema = Schema({
    module: {
        type: String,
        unique: true
    }
    ,
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = model( 'Access', accessSchema );