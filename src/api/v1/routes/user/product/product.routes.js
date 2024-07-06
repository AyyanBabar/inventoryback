const router = require("express").Router();
const productController = require('../../../controller/product/product.contoller')
const validation = require('../../../../../common/index')
const middleware = require('../../../../../middleware')

router.post('/create', validation.productValidaiton.create, middleware.isAuthencticated, productController.create);
router.get('/find', middleware.isAuthencticated, productController.find)
router.get('/findById/:id', middleware.isAuthencticated, productController.findById)
router.get('/findByCompanyName/:id', middleware.isAuthencticated, productController.findByCompanyName)
router.patch('/findByIdAndUpdate/:id', validation.productValidaiton.update, middleware.isAuthencticated,productController.findByIdandUpdate)
router.delete('/findByIdAndDelete/:id',  middleware.isAuthencticated, productController.findByIdandDelete)


module.exports = router






