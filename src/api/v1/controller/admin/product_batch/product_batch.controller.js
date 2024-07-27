const prodcutBatch = require('../../../../../model/product_batches.model')
const User = require('../../../../../model/index').user
const Product = require('../../../../model/index').product
const { ObjectId, MongoGridFSChunkError } = require('mongodb');
const mongoose = require('mongoose')

const ApiResponse = require('../../../../../Response/api.resposne')

const { validationResult } = require("express-validator");


const prodcutBatchController = {}

prodcutBatchController.create = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() })
        }
        const findUser = await User.findById(req.user._id)
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }
        console.log(req.body.productId)
        const findProduct = await Product.findById(req.body.productId)
        
        if (!findProduct) {
            return ApiResponse(res, 404, { status: false, msg: 'product not found', data: null })
        }
        const findBatchNumber = await prodcutBatch.findOne({ productId: req.body.productId })
        const newBatchData = {
            productId: req.body.productId,
            batchNumber: findBatchNumber ? (findBatchNumber.batchNumber ? findBatchNumber.batchNumber + 1 : 1) : 1,
            quantity: req.body.quantity,
            remainingQuantity: req.body.quantity,
            dateOfProduction: req.body.date
        }
        const newprodcutBatch = await prodcutBatch.create(newBatchData)
        return ApiResponse(res, 200, { status: true, msg: 'Batch cretad succesfully', data: newprodcutBatch })

    } catch (err) {
        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })

    }
}


prodcutBatchController.findById = async (req, res) => {
    try {
        const findUser = await User.findById(req.user._id)
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }
        const findProductBatch = await prodcutBatch.findById(req.params.id)

        if (!findProductBatch) {
            return ApiResponse(res, 404, { status: false, msg: 'productBatchNotfound', data: null })
        }

        const findProduct = await Product.findById(findProductBatch.productId)

        return ApiResponse(res, 200, { status: true, msg: 'Batch found', data: findProduct })

    } catch (err) {
        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })

    }

}

prodcutBatchController.findByIdandUpdate = async (req, res) => {
    try {
        if (!req.user) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid user', data: null })

        }
        const errors = validationResult(req)
        console.log(req.body)
        if (!errors.isEmpty()) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() })
        }
        const findUser = await User.findById(req.user._id)
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }

        const findProductBatch = await prodcutBatch.findById(req.params.id)

        if (!findProductBatch) {
            return ApiResponse(res, 404, { status: false, msg: 'productBatchNotfound', data: null })
        }

       
        if (req.body.quantity) findProductBatch.quantity = req.body.quantity;
        // if (req.body.data) findProductBatch.data = req.body.data;

        await findProductBatch.save()

        return ApiResponse(res, 200, { status: true, msg: 'udpated', data: findProductBatch });
    } catch (err) {
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}


prodcutBatchController.findByIdandDelete = async (req, res) => {
    try {
        if (!req.user) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid user', data: null })

        }
        const errors = validationResult(req)
        console.log(req.body)
        if (!errors.isEmpty()) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() })
        }
        const findUser = await User.findById(req.user._id)
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }

        const findProductBatch = await prodcutBatch.findById(req.params.id)

        if (!findProductBatch) {
            return ApiResponse(res, 404, { status: false, msg: 'productBatchNotfound', data: null })
        }

        await prodcutBatch.deleteOne({_id: req.params.id})
        return ApiResponse(res, 200, { status: true, msg: 'Batch deleted succesfully', data: null});

    } catch (err) {
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}


module.exports = prodcutBatchController