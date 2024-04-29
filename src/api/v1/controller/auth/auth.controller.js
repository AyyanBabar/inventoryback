const User = require('../../../../model/user.model');
const ApiResponse = require('../../../../Response/api.resposne')
const { validationResult } = require("express-validator");
const auth = {}


auth.register = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() })
        }
        const existingUser = await User.findOne({ email: req.body.email })

        if (existingUser) {
            return ApiResponse(res, 400, { status: false, msg: 'Email already exist', data: null })
        }
        const newUser = await User.create(req.body);
        const { password, ...rest } = newUser._doc
        return ApiResponse(res, 200, { status: true, msg: 'User created Succesfully and verification email has been sent', data: rest })
    } catch (err) {
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }

}

auth.login = async (req, res)=>{
    
}


module.exports = auth