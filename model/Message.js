const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    content: String,
    date: Date,
});

module.exports = mongoose.model('Message', messageSchema, 'Message');