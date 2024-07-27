const router = require('express').Router()
const adminBatchSalesController = require('../../../controller/admin/batch_sales/admin.batch_sales')
const validation = require('../../../../../common/index')
const middleware = require('../../../../../middleware');


router.post('/create', validation.batchSales.create, middleware.isAuthencticated, adminBatchSalesController.create)
// router.get('/getAllCompanies', middleware.isAuthencticated, companyController.get)
router.get('/getById/:id', middleware.isAuthencticated,  middleware.isAdmin, adminBatchSalesController.findById)
router.get('/find', middleware.isAuthencticated,  middleware.isAdmin, adminBatchSalesController.find)

router.patch('/getByIdAndUpdate/:id', validation.batchSales.update,  middleware.isAuthencticated, adminBatchSalesController.findByIdandUpdate)
router.delete('/getByIdAndDelete/:id', middleware.isAuthencticated, adminBatchSalesController.findByIdandDelete)

module.exports = router




