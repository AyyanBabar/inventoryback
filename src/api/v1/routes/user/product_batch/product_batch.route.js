const router = require("express").Router();
const prodcutBatchController= require('../../../controller/product_batch/product_btach.controller')
const validation = require('../../../../../common/index')
const middleware = require('../../../../../middleware')

router.post('/create', validation.productBatchValdataion.create, middleware.isAuthencticated, prodcutBatchController.create)
// router.get('/getAllCompanies', middleware.isAuthencticated, companyController.get)
router.get('/getById/:id', middleware.isAuthencticated, prodcutBatchController.findById)
router.get('/findByProductName/:id', middleware.isAuthencticated, prodcutBatchController.findByProductId)

router.patch('/getByIdAndUpdate/:id',validation.productBatchValdataion.update, middleware.isAuthencticated, prodcutBatchController.findByIdandUpdate)
router.delete('/findByIdAndDelete/:id',  middleware.isAuthencticated, prodcutBatchController.findByIdandDelete)

module.exports = router




