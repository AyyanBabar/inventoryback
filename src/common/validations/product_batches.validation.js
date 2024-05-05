const { body } = require('express-validator')

const create = [
    body('quantity')
        .notEmpty().withMessage('quantity is required')
        .isNumeric().withMessage('quantity must be string'),

    body('date')
        .notEmpty().withMessage('date is required')
        .isString().withMessage('date must be string'),
]

const update = [
    body('quantity').isNumeric().optional(),
    body('date').isString().optional()
]



module.exports = { create, update } 