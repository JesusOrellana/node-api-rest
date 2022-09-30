const { Schema, model } = require('mongoose');

const roleSchema = Schema({
    name: {
        type: String,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    }
});

module.exports = model( 'Role', roleSchema );