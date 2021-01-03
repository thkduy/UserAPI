const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
    },
    player1: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    },
    player2: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
    },
    result: Number,//0: draw, 1: player1 win, 2: player2 win
    firstMoveBy: Number,
    messages: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Message'
    }],
    steps: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Step'
    }]
});

module.exports = mongoose.model('Room', roomSchema, 'Room');