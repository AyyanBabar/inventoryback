const mongoose = require('mongoose');
const { company } = require('.');

const Schema = mongoose.Schema

const ProductSchema = mongoose.Schema({
    userId : {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'company'
    },
    companyName: {
        required: true,
        type: String
    },
    productName: {
        required: true,
        type: String
    },
    issueDate: {
        required: true,
        type: Date
    }

})

const Product = mongoose.model('Product', ProductSchema)
module.exports = Product