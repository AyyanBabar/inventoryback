const mongoose = require('mongoose');

const  UserSchema = mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    email: {
        required: true,
        unique: true,
        type: String
    },
    password: {
        required: true,
        type: String
    },
    role: {
        type: String,
        enum : ['user', 'admin'],
        default: 'user'
    }
})  

const  User = mongoose.model('user', UserSchema)
module.exports = User