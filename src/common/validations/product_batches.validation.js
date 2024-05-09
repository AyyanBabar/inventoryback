const { body } = require('express-validator')

const create = [
    body('quantity')
        .notEmpty().withMessage('quantity is required')
        .isNumeric().withMessage('quantity must be Number'),

    body('date')
        .notEmpty().withMessage('date is required')
        .isDate().withMessage('date must be string'),
]

const update = [
    body('quantity').isNumeric().optional(),
    body('date').isDate().optional()
]



module.exports = { create, update } 