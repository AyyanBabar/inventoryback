const router = require("express").Router();
const vendorsaleBatchController = require('../../controller/vendor/vendor.batch_sales')
const batchSalesController = require('../../controller/batch_sales/batch_sales.controller')
const validation = require('../../../../common/index')
const middleware = require('../../../../middleware');

router.post('/create', validation.batchSales.create, middleware.isAuthencticated, batchSalesController.create)
router.patch('/getByIdAndUpdate/:id', validation.batchSales.update, middleware.isAuthencticated, batchSalesController.findByIdandUpdate)
router.get('/findByBatchName/:id', middleware.isAuthencticated, vendorsaleBatchController.find)
router.delete('/getByIdAndDelete/:id', middleware.isAuthencticated, batchSalesController.findByIdandDelete)

module.exports = router