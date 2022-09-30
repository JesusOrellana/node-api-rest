const { Schema, model, now } = require('mongoose');

const userSchema = Schema({
    email: {
        type: String,
        required: [true, 'Mailing is required'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    dni: {
        type: String,
        default: "PENDING"
    },
    dniType: {
        type: Number,
        default: 1
    },
    profilePicture: {
        type: String,
        default: "PENDING"
    },
    name: {
        type: String,
        default: "PENDING"
    },
    lastName: {
        type: String,
        default: "PENDING"
    },
    phone: {
        type: String,
        default: "PENDING"
    },
    dateBirth: {
        type: Date,
        default: now()
    },
    role: {
        type: Schema.ObjectId,
        ref: 'Role'
    },
    dateCreated: {
        type: Date,
        default: now()
    },
    status: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
    emailCheck: {
        type: Boolean,
        default: false
    },
    address:{
        type: String,
        default: "PENDING"
    },
    gender:{
        type: String,
        default: "PENDING"
    },
    country:{
        type: String,
        default: "PENDING"
    },
    city:{
        type: String,
        default: "PENDING"
    }
});

userSchema.methods.toJSON = function() {
    const { __v, password, name, lastName, ...User } = this.toObject();
    User.name = `${name} ${lastName}`
    return User;
}

module.exports = model( 'User', userSchema );