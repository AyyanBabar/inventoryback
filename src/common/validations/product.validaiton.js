const { body } = require('express-validator')

const create= [
    body("productName")
    .notEmpty().withMessage('productName is required')
    .isString().withMessage('productName must be string'),

    body("issueDate")
    .notEmpty().withMessage(' issueDate is required')
    .isDate().withMessage('companyName must be string'),  

    body("companyId")
    .notEmpty().withMessage('companyId is required')
]


const update = [
    body("companyName").optional().isString(),
    body("productName").optional().isString(),
    body("issueDate").optional().isString(),
];

module.exports = {create, update}