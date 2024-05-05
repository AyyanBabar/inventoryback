const prodcutBatch = require('../../../../model/product_batches.model')
const User = require('../../../../model/index').user
const batchSales = require('../../../../model/index').batchSales

const Product = require('../../../../model/index').product
const { ObjectId, MongoGridFSChunkError } = require('mongodb');
const mongoose = require('mongoose')
const ApiResponse = require('../../../../Response/api.resposne')
const { validationResult } = require("express-validator");

const batchSalesController = {}

batchSalesController.create = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() })
        }
        const findUser = await User.findById(req.user._id)
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }
        const findProductBatch = await prodcutBatch.findById(req.body.batchId);
        if (!findProductBatch) {
            return ApiResponse(res, 404, { status: false, msg: 'product batch not found', data: null })
        }
        const findProduct = await Product.findById(findProductBatch.productId)

        if (!findProduct || findProduct.userId != req.user._id) {
            return ApiResponse(res, 404, { status: false, msg: 'product not user found', data: null })
        }

        const newBatchSalesData = {
            batchId: req.body.batchId,
            soldQuantity:  req.body.soldQuantity,
            dateOfSale: req.body.date
        }
        const newBatchSale = await batchSales.create(newBatchSalesData)
        findProductBatch.remainingQuantity = findProductBatch.remainingQuantity - req.body.soldQuantity
        await findProductBatch.save()
        return ApiResponse(res, 200, { status: true, msg: 'Batch cretad succesfully', data: newBatchSale })

    } catch (err) {
        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })

    }
}


batchSalesController.findById = async (req, res) => {
    try {
        const findUser = await User.findById(req.user._id)
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }
        const findBatchSales = await batchSales.findById(req.params.id)

        if (!findBatchSales) {
            return ApiResponse(res, 404, { status: false, msg: 'BatchsaleNotfound', data: null })
        }

        const findProductBatch = await prodcutBatch.findById(findBatchSales.batchId)

        if (!findProductBatch) {
            return ApiResponse(res, 404, { status: false, msg: 'productBatchNotfound', data: null })
        }

        const findProduct = await Product.findById(findProductBatch.productId)

        if (!findProduct || req.user._id != findProduct.userId) {
            return ApiResponse(res, 404, { status: false, msg: 'productBatch  found', data: null })
        }


        return ApiResponse(res, 200, { status: true, msg: 'sales Batch found', data: findBatchSales })

    } catch (err) {
        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })

    }

}

batchSalesController.findByIdandUpdate = async (req, res) => {
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

        const findBatchSales = await batchSales.findById(req.params.id)

        if (!findBatchSales) {
            return ApiResponse(res, 404, { status: false, msg: 'BatchsaleNotfound', data: null })
        }

        const findProductBatch = await prodcutBatch.findById(findBatchSales.batchId)

        if (!findProductBatch) {
            return ApiResponse(res, 404, { status: false, msg: 'productBatchNotfound', data: null })
        }

        const findProduct = await Product.findById(findProductBatch.productId)

        if (!findProduct || req.user._id != findProduct.userId) {
            return ApiResponse(res, 404, { status: false, msg: 'productBatch  found', data: null })
        }


        if (req.body.soldQuantity) findBatchSales.soldQuantity = req.body.soldQuantity;
        if (req.body.date) findBatchSales.dateOfSale = req.body.date;

        await findBatchSales.save()

        return ApiResponse(res, 200, { status: true, msg: 'udpated', data: findBatchSales });
    } catch (err) {
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}


batchSalesController.findByIdandDelete = async (req, res) => {
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

        const findBatchSales = await batchSales.findById(req.params.id)

        if (!findBatchSales) {
            return ApiResponse(res, 404, { status: false, msg: 'BatchsaleNotfound', data: null })
        }

        const findProductBatch = await prodcutBatch.findById(findBatchSales.batchId)

        if (!findProductBatch) {
            return ApiResponse(res, 404, { status: false, msg: 'productBatchNotfound', data: null })
        }

        const findProduct = await Product.findById(findProductBatch.productId)

        if (!findProduct || req.user._id != findProduct.userId) {
            return ApiResponse(res, 404, { status: false, msg: 'productBatch  found', data: null })
        }


        await batchSales.deleteOne({ _id: req.params.id })
        return ApiResponse(res, 200, { status: true, msg: 'sales deleted succesfully', data: null });

    } catch (err) {
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}


module.exports = batchSalesController