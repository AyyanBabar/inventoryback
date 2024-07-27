const Company = require('../../../../../model/company.model')
const prodcutBatch = require('../../../../../model/product_batches.model')
const User = require('../../../../../model/index').user
const batchSales = require('../../../../../model/index').batchSales

const Product = require('../../../../../model/index').product
const ApiResponse = require('../../../../../Response/api.resposne')
const { validationResult } = require("express-validator");

const adminController = {}

adminController.create = async (req, res) => {
    try {
        const findUser = await User.findById(req.user._id)
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() })
        }
        const existingUser = await User.findOne({ email: req.body.email })

        if (existingUser) {
            return ApiResponse(res, 400, { status: false, msg: 'Email already exist', data: null })
        }
        const newUser = await User.create(req.body);
        const { password, ...rest } = newUser._doc
        return ApiResponse(res, 200, { status: true, msg: 'User created Succesfully', data: rest })

    } catch (err) {
        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })

    }
}


adminController.find = async (req, res) => {
    try {
        // console.log(req)
        // console.log(req.body)
        const findUser = await User.findById(req.user._id)
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }
        const users = await User.find({}, '-password');

        return ApiResponse(res, 200, { status: true, msg: 'Users retrieved successfully', data: users });
    } catch (err) {
        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })

    }

}
adminController.delete = async (req, res) => {
    try {
        const findUser = await User.findById(req.user._id)
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }

        const userId = req.params.id;

        const userToDelete = await User.findById(userId);
        console.log(userId)
        if (!userToDelete) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }

        await User.findByIdAndDelete(userId);

        return ApiResponse(res, 200, { status: true, msg: 'User deleted successfully', data: null });
    } catch (err) {
        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}
adminController.getallusers = async (req, res) => {
    try {
        const findUser = await User.findById(req.user._id)
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }
        const users = await User.find({role: 'user'}, '_id name');

        return ApiResponse(res, 200, { status: true, msg: 'Users retrieved successfully', data: users });
    } catch (err) {
        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })

    }

}
adminController.getallcompanies = async (req, res) => {
    try {
        const findUser = await User.findById(req.user._id)
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }
        const companies = await Company.find({}, '_id companyName');

        return ApiResponse(res, 200, { status: true, msg: 'Companies retrieved successfully', data: companies });
    } catch (err) {
        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })

    }

}



module.exports = adminController