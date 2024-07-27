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
        if (req.body.soldQuantity > findProductBatch.remainingQuantity) {
            return ApiResponse(res, 400, { status: false, msg: 'Sold quantity exceeds remaining quantity', data: null })
        }
        if(findProductBatch.remainingQuantity==0){
            return ApiResponse(res, 400, { status: false, msg: 'all items sold', data: null })
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
batchSalesController.findByBatchId = async (req, res) => {
    try {
        // Ensure user exists
        const findUser = await User.findById(req.user._id);
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null });
        }
        
        const findBatchesSales = await batchSales.find({ batchId: req.params.id });

        if (findBatchesSales.length === 0) {    
            return ApiResponse(res, 404, { status: false, msg: 'Product batches not found', data: null });
        }

        // Filter batches for authorized products
        // const authorizedBatches = findBatchesSales.filter(batch => batch.userId===req.params._id);

        // // If no authorized batches found, return error
        // if (authorizedBatches.length === 0) {
        //     return ApiResponse(res, 404, { status: false, msg: 'No authorized batches found', data: null });
        // }

        return ApiResponse(res, 200, { status: true, msg: 'Batches found', data: findBatchesSales });

    } catch (err) {
        console.error(err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
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
        console.log(req.params)
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
        console.log(findBatchSales)

        if (!findBatchSales) {
            return ApiResponse(res, 404, { status: false, msg: 'BatchsaleNotfound', data: null })
        }

        const findProductBatch = await prodcutBatch.findById(findBatchSales.batchId)
        console.log(findProductBatch)

        if (!findProductBatch) {
            return ApiResponse(res, 404, { status: false, msg: 'productBatchNotfound', data: null })
        }

        const findProduct = await Product.findById(findProductBatch.productId)
        console.log(findProduct)

        if (!findProduct || req.user._id != findProduct.userId) {
            return ApiResponse(res, 404, { status: false, msg: 'productBatch  found', data: null })
        }
        if (req.body.soldQuantity > findProductBatch.quantity) {
            return ApiResponse(res, 400, { status: false, msg: 'Sold quantity exceeds product quantity', data: null })
        }
        if(findProductBatch.remainingQuantity==0){
            return ApiResponse(res, 400, { status: false, msg: 'All items sold', data: null })
        }

        if (req.body.soldQuantity) 
            {
                findBatchSales.soldQuantity = req.body.soldQuantity;
                findProductBatch.remainingQuantity = findProductBatch.quantity - req.body.soldQuantity
            }
        if(new Date(req.body.dateOfSale) < new Date(findProductBatch.dateOfProduction))
                {
                    return ApiResponse(res, 400, { status: false, msg: 'Date of Sale cannot be earlier than Date of Production', data: null});
                }
        if(new Date(req.body.dateOfSale) >= new Date(findProductBatch.dateOfProduction))
                {
                    findBatchSales.dateOfSale = new Date(req.body.dateOfSale);
                }
    
        await findBatchSales.save()
        await findProductBatch.save()
            console.log("Updated Product Batch", findProductBatch)
            console.log("Updated Batch Batch", findBatchSales)

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

        findProductBatch.remainingQuantity +=findBatchSales.soldQuantity
        findProductBatch.save()
        await batchSales.deleteOne({ _id: req.params.id })
        return ApiResponse(res, 200, { status: true, msg: 'sales deleted succesfully', data: null });

    } catch (err) {
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}


module.exports = batchSalesController