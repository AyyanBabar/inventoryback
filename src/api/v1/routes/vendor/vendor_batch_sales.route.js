const router = require("express").Router();
const vendorsaleBatchController = require('../../controller/vendor/vendor.batch_sales')
const validation = require('../../../../common/index')
const middleware = require('../../../../middleware');

router.post('/create', validation.batchSales.create, middleware.isAuthencticated, vendorsaleBatchController.create)
// router.get('/getAllCompanies', middleware.isAuthencticated, companyController.get)
router.get('/getById/:id', middleware.isAuthencticated, vendorsaleBatchController.findById)
router.patch('/getByIdAndUpdate/:id', validation.batchSales.update, middleware.isAuthencticated, vendorsaleBatchController.findByIdandUpdate)
router.get('/findByBatchName/:id', middleware.isAuthencticated, vendorsaleBatchController.find)

router.delete('/getByIdAndDelete/:id', middleware.isAuthencticated, vendorsaleBatchController.findByIdandDelete)

module.exports = router