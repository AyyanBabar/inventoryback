const ApiResponse = require('../../Response/api.resposne')
const jwt = require('jsonwebtoken')
const jwtSecret = require('../../config/jwtConfig/jwtconfig').secret


function isAuthencticated(req, res, next) {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return ApiResponse(res, 404, { status: false, msg: 'Please prvide token', data: null })
        }
        const verify = jwt.verify(token, jwtSecret)
        if (!verify) {
            return ApiResponse(res, 401, { status: false, msg: 'Invalid token', data: null })
        }
        console.log(verify)
        req.user = verify
        next()
    } catch (err) {
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}

module.exports = isAuthencticated

