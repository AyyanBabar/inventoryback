const User = require('../../../../../model/index').user
const Company = require('../../../../../model/index').company
const ApiResponse = require('../../../../../Response/api.resposne')
const { validationResult } = require("express-validator");

const adminComapnyController = {}


adminComapnyController.create = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() })
        }
        const findUser = await User.findById(req.user._id)
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }
        const existingCompany = await Company?.findOne({ companyName: req.body.companyName })

        if (existingCompany) {
            return ApiResponse(res, 400, { status: false, msg: 'company  already exist', data: null })
        }
        const newCompanyData = {
            userId: req.body.userId,
            companyName: req.body.companyName,
            companyAddress: req.body.companyAddress,
            contact: req.body.contact
        };
        
        const newCompany = await Company.create(newCompanyData)
        return ApiResponse(res, 200, { status: true, msg: 'Company created Succesfully', data: newCompany, })
    } catch (err) {
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}

adminComapnyController.get = async (req, res) => {
    try {
        
        const findUser = await User.findById(req.user._id)
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }
        const findCompanies = await Company.find()
        if (!findCompanies) {
            return ApiResponse(res, 404, { status: false, msg: 'No company is associated with this user', data: null })
        }
        return ApiResponse(res, 200, { status: true, msg: 'Companies', data: findCompanies })

    } catch (err) {
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}

adminComapnyController.findById = async (req, res) => {
    try {
        const findUser = await User.findById(req.user._id)
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }
        const company = await Company.findOne({ _id: req.params.id }) 
        if (!company) {
            return ApiResponse(res, 404, { status: false, msg: 'Company not found', data: null });
        } 
        return ApiResponse(res, 200, { status: true, msg: 'Company found', data: company });
    } catch (err) {
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}


adminComapnyController.findByIdandUpdate = async (req, res) => {
    try {
        const errors = validationResult(req)
        console.log(errors)
        if (!errors.isEmpty()) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() })
        }
        const findUser = await User.findById(req.user._id)
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }
        const findcompany = await Company.findOne({ _id: req.params.id})
        if (!findcompany) {
            return ApiResponse(res, 404, { status: false, msg: 'Company not found', data: null });
        } 
        if (req.body.companyName) findcompany.companyName = req.body.companyName;
        if (req.body.companyAddress) findcompany.companyAddress = req.body.companyAddress;
        if (req.body.companyContact) findcompany.companyContact = req.body.companyContact;

        await findcompany.save()

        return ApiResponse(res, 200, { status: true, msg: 'Company found', data: findcompany});
    } catch (err) {
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}


adminComapnyController.findByIdandDelete = async (req, res) => {
    try {
        const findUser = await User.findById(req.user._id)
        if (!findUser) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
        }
        const findcompany = await Company.findOne({ _id: req.params.id })
        if (!findcompany) {
            return ApiResponse(res, 404, { status: false, msg: 'Company not found', data: null });
        } 
        
        console.log(findcompany)
        await Company.deleteOne({_id: req.params.id})
        return ApiResponse(res, 200, { status: true, msg: 'Company deleted succesfully', data: findcompany});
    } catch (err) {
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}

module.exports = adminComapnyController