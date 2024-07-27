
const User = require('../../../../../model/index').user
const Product = require('../../../../../model/index').product
const ApiResponse = require('../../../../../Response/api.resposne')
const { validationResult } = require("express-validator");
const Company = require('../../../../../model/index').company

const productController = {}


productController.create = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return ApiResponse(res, 404, { status: false, msg: 'Invalid input', data: errors.array() })
        }
        const findUser = await User.findById(req.user._id)
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }
        const company = await Company.findOne({ _id: req.body.companyId })
        if (!company) {
            return ApiResponse(res, 404, { status: false, msg: 'company dont exist', data: null })

        }
        const existingProduct = await Product?.findOne({ companyId: company._id, productName: req.body.productName })
        if (existingProduct) {
            return ApiResponse(res, 404, { status: false, msg: ' product already exist', data: null })
        }
        const newProductData = {
            userId: req.user._id,
            companyId: company._id,
            companyName: company.companyName,
            productName: req.body.productName,
            issueDate: req.body.issueDate
        };

        const newProduct = await Product.create(newProductData)
        return ApiResponse(res, 200, { status: true, msg: 'Product created Succesfully', data: newProduct })
    } catch (err) {

        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}


productController.find = async (req, res) => {
    try {
        const findUser = await User.findById(req.user._id)
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }
        const findProduct = await Product.find()
        if (findProduct.length <= 0) {
            return ApiResponse(res, 404, { status: false, msg: 'No product is associated with this user', data: null })
        }

        return ApiResponse(res, 200, { status: true, msg: 'Product', data: findProduct })
    } catch (err) {

        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}

productController.findByCompanyName = async (req, res) => {
    try {
        console.log(req.query.companyName)
        const findUser = await User.findById(req.user._id)
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }
        console.log(findUser)

        const findProduct = await Product.find({  companyName: req.query.companyName })
        console.log(findProduct)
        if (findProduct <= 0) {
            return ApiResponse(res, 404, { status: false, msg: 'No product is associated with this company', data: null })
        }
        return ApiResponse(res, 200, { status: true, msg: 'Product', data: findProduct })
    } catch (err) {

        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}


productController.findById = async (req, res) => {
    try {
        console.log(req.params.id)
        const findUser = await User.findById(req.user._id)
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }
        const product = await Product.findOne({ _id: req.params.id})
        if (!product) {
            return ApiResponse(res, 404, { status: false, msg: 'Product not found', data: null });
        }
        return ApiResponse(res, 200, { status: true, msg: 'Product found', data: product });
    } catch (err) {
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}

productController.findByIdandUpdate = async (req, res) => {
    try {
        const errors = validationResult(req)
        console.log(req.body)
        if (!errors.isEmpty()) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() })
        }
        const findUser = await User.findById(req.user._id)
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }
        if (req.body.companyName) {
            const findCompany = await Company.findOne({companyName: req.body.companyName })
            if (!findCompany) {
                return ApiResponse(res, 400, { status: false, msg: 'compnay dont exist', data: null })
            }
        }
        const findProduct = await Product.findOne({ _id: req.params.id })
        if (!findProduct) {
            return ApiResponse(res, 400, { status: false, msg: 'prodcut dont exist', data: null })
        }
        if (req.body.companyName) findProduct.companyName = req.body.companyName;
        if (req.body.productName) findProduct.productName = req.body.productName;
        if (req.body.issueDate) findProduct.issueDate = req.body.issueDate;

        await findProduct.save()

        return ApiResponse(res, 200, { status: true, msg: 'Company found', data: findProduct });
    } catch (err) {
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}

productController.findByIdandDelete = async (req, res) => {
    try {
        const findUser = await User.findById(req.user._id)
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }
        const findProduct = await Product.findOne({ _id: req.params.id })
        if (!findProduct) {
            return ApiResponse(res, 404, { status: false, msg: 'Product not found', data: null });
        } 
        await Product.deleteOne({_id: req.params.id})
        return ApiResponse(res, 200, { status: true, msg: 'Product deleted succesfully', data: null});
    } catch (err) {
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}


module.exports = productController