const { body } = require('express-validator')

const create= [
    body("companyName")
    .notEmpty().withMessage('companyName is required')
    .isString().withMessage('companyName must be string'),

    body("companyAddress")
    .notEmpty().withMessage('companyAddress is required')
    .isString().withMessage('companyAddress must be string'),

    body("contact")
    .notEmpty().withMessage('companyContact is required')
    .isString().withMessage('companyContact must be string'),
]

const update = [
    body("companyName").optional().isString(),
    body("companyAddress").optional().isString(),
    body("contact").optional().isString(),
];

module.exports = {create, update}