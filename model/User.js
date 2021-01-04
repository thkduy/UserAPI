const mongoose = require('mongoose');

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
    avatar: String,
    accountType: {
        type: String,
        default: 'account'
    },
    accountId: {
        type: String,
        default: ''
    },
    createdDate: {
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
    },
    point: {
        type: Number,
        default: 1000,
    },
    totalWin: {
        type: Number,
        default: 0,
    },
    numOfMatches: {
        type: Number,
        default: 0,
    }
});

// userSchema.methods.isValidPassword = async function(password) {
//     const user = this;
//     const compare = await bcrypt.compareSync(password, user.password);
  
//     return compare;
//   }

module.exports = mongoose.model('User', userSchema, 'User');