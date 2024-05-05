const mongoose = require('mongoose');

const Schema = mongoose.Schema

const productBatchesSchema = Schema({
    productId : {
        type: Schema.Types.ObjectId,
        ref: 'product'
    },
    batchNumber : {
        required: true,
        type: Number
    },
    quantity: {
        required: true,
        type: Number
    },
    remainingQuantity: {
        required:  true,
        type: Number
    },
    dateOfProduction: { 
        required:  true,
        type : String
    }
})

const ProductBatches = mongoose.model('Productbatches', productBatchesSchema)
module.exports = ProductBatches