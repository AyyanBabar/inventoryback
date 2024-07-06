const prodcutBatch = require('../../../../model/product_batches.model')
const User = require('../../../../model/index').user
const batchSales = require('../../../../model/index').batchSales
const Product = require('../../../../model/index').product
// const { ObjectId, MongoGridFSChunkError } = require('mongodb');
const mongoose = require('mongoose')
const ApiResponse = require('../../../../Response/api.resposne')
const { validationResult } = require("express-validator");

const vendorsaleBatchController = {}

vendorsaleBatchController.create = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() });
        }
    
        const findUser = await User.findById(req.user._id);
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null });
        }
    
        const findProductBatch = await prodcutBatch.findById(req.body.batchId);
        if (!findProductBatch) {
            return ApiResponse(res, 404, { status: false, msg: 'Product batch not found', data: null });
        }
    
        const findProduct = await Product.findById(findProductBatch.productId);
        if (!findProduct) {
            return ApiResponse(res, 404, { status: false, msg: 'Product not found', data: null });
        }
    
        const newBatchSalesData = {
            userId: req.user._id,
            batchId: req.body.batchId,
            soldQuantity: req.body.soldQuantity,
            dateOfSale: req.body.date
        };
    
        const totalSold = await batchSales.aggregate([
            {
                $match: {
                    batchId: new mongoose.Types.ObjectId(req.body.batchId)
                }
            },
            {
                $group: {
                    _id: null,
                    totalSoldQuantity: { $sum: "$soldQuantity" }
                }
            }
        ]);
    
        const currentSoldQuantity = totalSold.length > 0 ? totalSold[0].totalSoldQuantity : 0;
        const newTotalSoldQuantity = currentSoldQuantity + Number(req.body.soldQuantity);
    
        if (newTotalSoldQuantity <= findProductBatch.quantity) {
            findProductBatch.remainingQuantity = findProductBatch.quantity - newTotalSoldQuantity;
    
            const newBatchSale = await batchSales.create(newBatchSalesData);
            await findProductBatch.save();
    
            return ApiResponse(res, 200, { status: true, msg: 'Batch created successfully', data: newBatchSale });
        } else {
            console.log("Error")
            return ApiResponse(res, 404, { status: false, msg: 'Sold quantity exceeds Product Quantity', data: null });
        }
    
    } catch (err) {
        console.log(err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
    }
}

vendorsaleBatchController.find = async (req, res) => {
    try {
        const findUser = await User.findById(req.user._id)
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }
        const findProductBatch = await batchSales.find({userId: req.user._id})
        if (findProductBatch.length <= 0) {
            return ApiResponse(res, 404, { status: false, msg: 'No product is associated with this user', data: null })
        }

        return ApiResponse(res, 200, { status: true, msg: 'Product', data: findProductBatch })
    } catch (err) {

        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}

vendorsaleBatchController.findById = async (req, res) => {
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

        if (!findProduct ) {
            return ApiResponse(res, 404, { status: false, msg: 'productBatch  found', data: null })
        }


        return ApiResponse(res, 200, { status: true, msg: 'sales Batch found', data: findBatchSales })

    } catch (err) {
        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })

    }

}

vendorsaleBatchController.findByIdandUpdate = async (req, res) => {
    try {
        if (!req.user) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid user', data: null });
        }

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() });
        }

        const findUser = await User.findById(req.user._id);
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null });
        }

        const findBatchSales = await batchSales.findById(req.params.id);
        if (!findBatchSales) {
            return ApiResponse(res, 404, { status: false, msg: 'Batch sale not found', data: null });
        }
        console.log(findBatchSales)
        // const oneBatchSales = await batchSales.findOne({ batchId: findBatchSales.batchId, userId: req.user._id });
        // if (!oneBatchSales) {
        //     return ApiResponse(res, 404, { status: false, msg: 'Batch sale not found for this user', data: null });
        // }
        // console.log(oneBatchSales)
        const findProductBatch = await prodcutBatch.findById(findBatchSales.batchId);
        if (!findProductBatch) {
            return ApiResponse(res, 404, { status: false, msg: 'Product batch not found', data: null });
        }

        const findProduct = await Product.findById(findProductBatch.productId);
        if (!findProduct) {
            return ApiResponse(res, 404, { status: false, msg: 'Product not found', data: null });
        }

        if (req.body.soldQuantity <= 0) {
            return ApiResponse(res, 400, { status: false, msg: 'Sold quantity cannot be negative or zero', data: null });
        }

        const totalSold = await batchSales.aggregate([
            { $match: { batchId: new mongoose.Types.ObjectId(findBatchSales.batchId) } },
            { $group: { _id: "$batchId", total: { $sum: "$soldQuantity" } } }
        ]);
        console.log(totalSold[0].total)
        const currentSoldQuantity = totalSold.length > 0 ? totalSold[0].total : 0;
        const newTotalSoldQuantity = currentSoldQuantity - findBatchSales.soldQuantity + Number(req.body.soldQuantity);

        if (newTotalSoldQuantity > findProductBatch.quantity) {
            return ApiResponse(res, 400, { status: false, msg: 'Sold quantity exceeds total quantity', data: null });
        }

        if (new Date(req.body.dateOfSale) < new Date(findProductBatch.dateOfProduction)) {
            return ApiResponse(res, 400, { status: false, msg: 'Date of sale cannot be earlier than date of production', data: null });
        }

        findBatchSales.soldQuantity = req.body.soldQuantity;
        findBatchSales.dateOfSale = new Date(req.body.dateOfSale);

        await findBatchSales.save();

        findProductBatch.remainingQuantity = findProductBatch.quantity - newTotalSoldQuantity;

        await findProductBatch.save();

        return ApiResponse(res, 200, { status: true, msg: 'Batch sale updated successfully', data: findBatchSales });
    } catch (err) {
        console.log(err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal server error', data: err.message });
    }
}


vendorsaleBatchController.findByIdandDelete = async (req, res) => {
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

        if (!findProduct) {
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


module.exports = vendorsaleBatchController