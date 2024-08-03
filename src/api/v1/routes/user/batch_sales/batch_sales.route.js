const router = require("express").Router();
const saleBatchController = require('../../../controller/batch_sales/batch_sales.controller')
const validation = require('../../../../../common/index')
const middleware = require('../../../../../middleware');


router.post('/create', validation.batchSales.create, middleware.isAuthencticated, saleBatchController.create)
// router.get('/getAllCompanies', middleware.isAuthencticated, companyController.get)
// router.get('/getById/:id', middleware.isAuthencticated, saleBatchController.findById)
router.patch('/getByIdAndUpdate/:id', validation.batchSales.update, middleware.isAuthencticated, saleBatchController.findByIdandUpdate)
router.get('/findByBatchName/:id', middleware.isAuthencticated, saleBatchController.findByBatchId)

router.delete('/getByIdAndDelete/:id', middleware.isAuthencticated, saleBatchController.findByIdandDelete)

module.exports = router




