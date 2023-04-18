const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    image: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    is_online: {
        type: String,
        default: '0'
    }
},
{
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);