const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    accountType: {
        type: String,
        default: 'account'
    },
    accountId: {
        type: String,
        default: ''
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        required: true
    },
    Date: {
        type: Date,
        default: Date.now
    },
    isDelete: {
        type: Boolean,
        default: false
    },
    isActivate: {
        type: Boolean,
        default: false,
    }
});

module.exports = mongoose.model('User', userSchema, 'User');