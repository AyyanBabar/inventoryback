const router = require("express").Router();
const auth = require('../auth/auth.routes')
const company = require('./company/company.routes')
const product = require('./product/product.routes')
const productBatch = require('./product_batch/product_batch.route')
const batchSales = require('./batch_sales/batch_sales.route')
const adminUser =  require('../admin/user/admin.user.route')
router.use('/auth', auth)
router.use('/company', company)
router.use('/product', product)
router.use('/productBatch', productBatch)
router.use('/batchSales', batchSales )

module.exports = router