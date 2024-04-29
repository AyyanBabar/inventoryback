const mongoose = require('mongoose');
const role = require('../config/roles/roles')

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
        enum : [role.user, role.admin],
        default: role.user
    },
    isVerified: {
        type: Boolean,
        required: true,
        default: false
    }
})  

const  User = mongoose.model('user', UserSchema)
module.exports = User