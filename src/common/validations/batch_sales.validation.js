const { body } = require('express-validator')

const create = [
    body('soldQuantity')
        .notEmpty().withMessage('quantity is required')
        .isNumeric().withMessage('quantity must be number'),

    body('date')
        .notEmpty().withMessage('date is required')
        .isString().withMessage('date must be string'),
]

const update = [
    body('soldQuantity').isNumeric().optional(),
    body('date').isString().optional()
]



module.exports = { create, update } 