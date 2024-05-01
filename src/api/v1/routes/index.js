const router = require("express").Router();
const auth = require('./auth/auth.routes')
const company = require('./company/company.routes')
const product = require('./product/product.routes')
router.use('/auth', auth)
router.use('/company', company)
router.use('/product', product)
module.exports = router