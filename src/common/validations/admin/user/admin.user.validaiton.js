const { body } = require('express-validator')

const create= [
    body('name')
        .notEmpty().withMessage('name is required')
        .isString().withMessage('name must be string'),

    body('email')
        .notEmpty().withMessage('email is required')
        .isString().withMessage('email must be string')
        .isEmail().withMessage('invalid email'),

    body('password')
        .notEmpty().withMessage('password is required')
        .isString().withMessage('password must be string')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

        body("role").optional().isString(),
        body("isverified").optional().isBoolean(),

]


module.exports = { create }