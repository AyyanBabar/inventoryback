const router = require("express").Router();
const auth = require('../auth/auth.routes')

const vendorBatchSales = require("../vendor/vendor_batch_sales.route")

router.use('/vendorBatchSales', vendorBatchSales)

module.exports = router