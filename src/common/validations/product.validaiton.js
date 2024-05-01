const { body } = require('express-validator')

const create= [
    body("productName")
    .notEmpty().withMessage('productName is required')
    .isString().withMessage('productName must be string'),

    body("issueDate")
    .notEmpty().withMessage(' issueDate is required')
    .isString().withMessage('companyName must be string'),  

    body("companyName")
    .notEmpty().withMessage('companyName is required')
    .isString().withMessage('companyName must be string'),  
]


const update = [
    body("companyName").optional().isString(),
    body("productName").optional().isString(),
    body("issueDate").optional().isString(),
];

module.exports = {create, update}