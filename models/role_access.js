const { Schema, model } = require('mongoose');

const roleAccessSchema = Schema({

    role: {
        type: Schema.ObjectId,
        ref: 'Role'
    },
    access: {
        type: Schema.ObjectId,
        ref: 'Access'
    },
    status: {
        type: Boolean,
        default: true
    },
    create: {
        type: Boolean,
        default: false
    },
    read: {
        type: Boolean,
        default: false
    },
    update: {
        type: Boolean,
        default: false
    },
    delete: {
        type: Boolean,
        default: false
    },
    manage: {
        type: Boolean,
        default: false
    }
});

module.exports = model( 'Role_Access', roleAccessSchema );