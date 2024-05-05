const mongoose = require('mongoose');

const Schema = mongoose.Schema

const batchSalesSchema = Schema({
    batchId : {
        type: Schema.Types.ObjectId,
        ref: 'productbatches'
    },
    soldQuantity: {
        required:  true,
        type: Number
    },
    dateOfSale: { 
        required:  true,
        type : String
    }
})

const batchSales = mongoose.model('Sales', batchSalesSchema)
module.exports = batchSales