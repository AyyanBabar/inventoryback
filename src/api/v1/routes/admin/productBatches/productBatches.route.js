const router = require("express").Router();
const prodcutBatchController= require('../../../controller/product_batch/product_btach.controller')
const validation = require('../../../../../common/index')
const middleware = require('../../../../../middleware');

router.post('/create', validation.productBatchValdataion.create, middleware.isAuthencticated, prodcutBatchController.create)
router.get('/getById/:id', middleware.isAuthencticated, middleware.isAdmin, prodcutBatchController.findById)
router.get('/find', middleware.isAuthencticated, middleware.isAdmin, prodcutBatchController.find)

router.patch('/findByIdAndUpdate/:id',validation.productBatchValdataion.update, middleware.isAuthencticated, prodcutBatchController.findByIdandUpdate)
router.delete('/findByIdAndDelete/:id',  middleware.isAuthencticated, prodcutBatchController.findByIdandDelete)

module.exports = router




