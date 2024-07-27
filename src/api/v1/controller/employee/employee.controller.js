const User = require('../../../../model/index').user
const Employee = require('../../../../model/index').employee
const Company = require('../../../../model/company.model');
const ProductBatches = require('../../../../model/product_batches.model');
const BatchSales = require('../../../../model/batch_sales.model');
const Product = require('../../../../model/index').product;
const ApiResponse = require('../../../../Response/api.resposne')
const { validationResult } = require("express-validator");

const employeeController = {}

employeeController.associate = async (req, res) => {
    try {
        console.log("API")
        const findUser = await User.findById(req.body.userId)
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }
        findUser.role = 'employee';
        await findUser.save();
        
        // const errors = validationResult(req)
        // if (!errors.isEmpty()) {
        //     return ApiResponse(res, 404, { status: false, msg: 'Invalid input', data: errors.array() })
        // }
        const existingemployee = await Employee.findOne({ userId: req.body.userId, companyId: req.body.companyId })

        if (existingemployee) {
            return ApiResponse(res, 404, { status: false, msg: 'Employee already associated', data: null })
        }
        // await Employee.deleteMany({});
        const newEmployee = await Employee.create(req.body)
        console.log(newEmployee)
        // const allemployee1 = await Employee.find();
        // console.log(allemployee1)
        // await Employee.deleteOne(newEmployee._id)
        // const allemployee2 = await Employee.find();
        // console.log(allemployee2)
        return ApiResponse(res, 200, { status: true, msg: 'Employee Associated Succesfully', data: null })

    } catch (err) {
        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })

    }
}
employeeController.getcompany = async (req, res) => {
    try{
        const company = await Employee.findOne({userId: req.user._id})
        if (!company) {
            return ApiResponse(res, 404, { status: false, msg: 'No company associated', data: null })
        };
        const companyName = await Company.findById({_id :company.companyId}, 'companyName')
        return ApiResponse(res, 200, { status: true, msg: 'Company Found', data: companyName })
    }
    catch (err){ 
        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}
employeeController.fetchProducts = async (req, res) => {
    try {
        const company = await Employee.findOne({userId: req.user._id})
        if (!company) {
            return ApiResponse(res, 404, { status: false, msg: 'No company associated', data: null })
        };
        const companyName = await Company.findById({_id :company.companyId})

        const findProduct = await Product.find({companyId: companyName._id})
        if (findProduct.length <= 0) {
            return ApiResponse(res, 404, { status: false, msg: 'No product is associated with this company', data: null })
        }

        return ApiResponse(res, 200, { status: true, msg: 'Product', data: findProduct })
    } catch (err) {

        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}
employeeController.fetchbatches = async (req, res) => {
    try {
        const company = await Employee.findOne({userId: req.user._id})
        if (!company) {
            return ApiResponse(res, 404, { status: false, msg: 'No company associated', data: null })
        };
        const products= await Product.find({companyId: company.companyId});
        if (products.length <= 0) {
            return ApiResponse(res, 404, { status: false, msg: 'No product is associated with this company', data: null })
        }
        const productIds = products.map(product=> product._id)
        const productbatches = await ProductBatches.find({productId: {$in: productIds}})
        // console.log(productbatches)
        return ApiResponse(res, 200, { status: true, msg: 'Product Batch retrieved successfully', data: productbatches });
    } catch (err) {
        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })

    }

}
employeeController.fetchbatchsales = async (req, res) => {
    try {
        const company = await Employee.findOne({userId: req.user._id})
        if (!company) {
            return ApiResponse(res, 404, { status: false, msg: 'No company associated', data: null })
        };
        const products= await Product.find({companyId: company.companyId});
        if (products.length <= 0) {
            return ApiResponse(res, 404, { status: false, msg: 'No product is associated with this company', data: null })
        }
        const productIds = products.map(product=> product._id)
        const productbatches = await ProductBatches.find({productId: {$in: productIds}})
        const ids = productbatches.map(batch => batch._id)
        const batchSales = await BatchSales.find({batchId: {$in: ids}})
        // console.log(productbatches)
        return ApiResponse(res, 200, { status: true, msg: 'Product Batch retrieved successfully', data: batchSales });
    } catch (err) {
        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })

    }

}

module.exports = employeeController