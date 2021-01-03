const mongoose = require('mongoose');

const stepSchema = new mongoose.Schema({
    stepNumber: {
        type: Number,
        required: true,
    },
    positionX: {
        type: Number,
        required: true,
    },
    positionY: {
        type: Number,
        required: true,
    }
});

module.exports = mongoose.model('Step', stepSchema, 'Step');