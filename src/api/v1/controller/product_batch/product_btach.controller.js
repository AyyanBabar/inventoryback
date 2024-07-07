const prodcutBatch = require('../../../../model/product_batches.model')
const User = require('../../../../model/index').user
const Product = require('../../../../model/index').product
const { ObjectId, MongoGridFSChunkError } = require('mongodb');
const mongoose = require('mongoose')
const ApiResponse = require('../../../../Response/api.resposne')
const { validationResult } = require("express-validator");

const prodcutBatchController = {}

// prodcutBatchController.create = async (req, res) => {
//     try {
//         const errors = validationResult(req)
//         if (!errors.isEmpty()) {
//             return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() })
//         }
//         const findUser = await User.findById(req.user._id)
//         if (!findUser) {
//             return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
//         }
//         const findProduct = await Product.findById(req.body.productId)
        
//         if (!findProduct || findProduct.userId != req.user._id) {
//             return ApiResponse(res, 404, { status: false, msg: 'product not found', data: null })
//         }
//         const findBatchNumber = await prodcutBatch.findOne({ productId: req.body.productId })
//         const newBatchData = {
//             productId: req.body.productId,
//             batchNumber: findBatchNumber ? (findBatchNumber.batchNumber ? findBatchNumber.batchNumber + 1 : 1) : 1,
//             quantity: req.body.quantity,
//             remainingQuantity: req.body.quantity,
//             dateOfProduction: req.body.date
//         }
//         const newprodcutBatch = await prodcutBatch.create(newBatchData)
//         return ApiResponse(res, 200, { status: true, msg: 'Batch cretad succesfully', data: newprodcutBatch })

//     } catch (err) {
//         console.log(err)
//         return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })

//     }
// }

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
        const findProduct = await Product.findById(req.body.productId)
        
        if (!findProduct) {
            return ApiResponse(res, 404, { status: false, msg: 'Product not found', data: null })
        }
        const findBatchNumbers = await prodcutBatch.find({ productId: req.body.productId }).sort({ batchNumber: -1 }).limit(1);
        let batchNumber = 1;
        if (findBatchNumbers.length > 0) {
            batchNumber = findBatchNumbers[0].batchNumber + 1;
        }
        const newBatchData = {
            productId: req.body.productId,
            batchNumber: batchNumber,
            quantity: req.body.quantity,
            remainingQuantity: req.body.quantity,
            dateOfProduction: req.body.date
        }
        const newprodcutBatch = await prodcutBatch.create(newBatchData)
        return ApiResponse(res, 200, { status: true, msg: 'Batch created successfully', data: newprodcutBatch })

    } catch (err) {
        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })

    }
}

prodcutBatchController.find = async (req, res) => {
    try {

        const findUser = await User.findById(req.user._id)
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }
        const productBatches= await prodcutBatch.find();
        return ApiResponse(res, 200, { status: true, msg: 'Product BAtch retrieved successfully', data: productBatches });
    } catch (err) {
        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })

    }

}

// prodcutBatchController.findByProductId = async (req, res) => {
//     try {
//         const findUser = await User.findById(req.user._id)
//         if (!findUser) {
//             return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
//         }
//         const findProductBatch = await prodcutBatch.find({productId: req.params.id})

//         if (!findProductBatch) {    
//             return ApiResponse(res, 404, { status: false, msg: 'productBatchNotfound', data: null })
//         }

//         const findProduct = await Product.findById(findProductBatch.productId)

//         if (req.user._id != findProduct.userId) {
//             return ApiResponse(res, 404, { status: false, msg: 'productBatch  found', data: null })
//         }

//         return ApiResponse(res, 200, { status: true, msg: 'Batch found', data: findProductBatch })

//     } catch (err) {
//         console.log(err)
//         return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })

//     }

// }

prodcutBatchController.findByProductId = async (req, res) => {
    try {
        // Ensure user exists
        const findUser = await User.findById(req.user._id);
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null });
        }
        
        // Find batches for the given product ID
        const findProductBatches = await prodcutBatch.find({ productId: req.params.id });

        // If no batches found, return error
        if (findProductBatches.length === 0) {    
            return ApiResponse(res, 404, { status: false, msg: 'Product batches not found', data: null });
        }

        // Filter batches for authorized products
        const authorizedBatches = findProductBatches.filter(batch => batch.userId===req.params._id);

        // If no authorized batches found, return error
        if (authorizedBatches.length === 0) {
            return ApiResponse(res, 404, { status: false, msg: 'No authorized batches found', data: null });
        }

        return ApiResponse(res, 200, { status: true, msg: 'Batches found', data: authorizedBatches });

    } catch (err) {
        console.error(err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
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

        if (req.user._id != findProduct.userId) {
            return ApiResponse(res, 404, { status: false, msg: 'productBatch  found', data: null })
        }

        return ApiResponse(res, 200, { status: true, msg: 'Batch found', data: findProductBatch })

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

        const findProduct = await Product.findById(findProductBatch.productId)

        

        if (req.body.quantity){
            findProductBatch.quantity = req.body.quantity;
            findProductBatch.remainingQuantity = req.body.quantity
        }
        if (req.body.data) findProductBatch.data = req.body.data;

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

        const findProduct = await Product.findById(findProductBatch.productId)

   

        await prodcutBatch.deleteOne({_id: req.params.id})
        return ApiResponse(res, 200, { status: true, msg: 'Batch deleted succesfully', data: null});

    } catch (err) {
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}


module.exports = prodcutBatchController
