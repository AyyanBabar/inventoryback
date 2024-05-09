const router = require("express").Router();
    
const adminUser =  require('./user/admin.user.route')
const adminCompany = require('./company/admin.company.routes')
const adminProduct = require('./product/product.company.route')
const adminProductBatch = require('./productBatches/productBatches.route')
const adminBatchSale = require('./batch_sales/admin.batch_sales') 
router.use('/user', adminUser)
router.use('/company', adminCompany)
router.use('/product', adminProduct )
router.use('/productBatch', adminProductBatch )
router.use('/batchSale', adminBatchSale )

module.exports = router 