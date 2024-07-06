const mongoose = require('mongoose');

const Schema = mongoose.Schema

const batchSalesSchema = Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    batchId : {
        type: Schema.Types.ObjectId,
        ref: 'Productbatches'
    },
    soldQuantity: {
        required:  true,
        type: Number
    },
    dateOfSale: { 
        required:  true,
        type : Date
    }
})

const batchSales = mongoose.model('Sales', batchSalesSchema)
module.exports = batchSales