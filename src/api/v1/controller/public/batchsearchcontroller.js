const { default: mongoose } = require('mongoose');
const Product = require('../../../../model/product.model');
const ProductBatches = require('../../../../model/product_batches.model')
// const Product = require('../../../../model/index').product
const ApiResponse = require('../../../../Response/api.resposne')
const { validationResult } = require("express-validator");

const batchSearchController = {}

batchSearchController.find = async (req, res) =>{
    try{
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() })
        }
        // console.log(req.body)
        const {id} = req.params;
        console.log(id)
        console.log("API HIT")
        // if(!mongoose.Types.ObjectId.isValid(id)){
        //     console.log("Invalid ID")
        // }
        const productBatch = await ProductBatches.findById(id).populate('productId');
        if (!productBatch) {
            return ApiResponse(res, 404, { status: false, msg: 'Product not found', data: null })
        }
        return ApiResponse(res, 200, { status: true, msg: 'Product Found', data: productBatch });
    }
    catch (err) {
        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })

    }
}

module.exports = batchSearchController