const router = require("express").Router();
const productController = require('../../../controller/admin/product/product.controller')
const validation = require('../../../../../common/index')
const middleware = require('../../../../../middleware');
const isAdmin = require("../../../../../middleware/auth/authorization");

router.post('/create', validation.productValidaiton.create,  middleware.isAuthencticated, isAdmin, productController.create);
router.get('/find', middleware.isAuthencticated, isAdmin, productController.find)
router.get('/findById/:id', middleware.isAuthencticated, middleware.isAdmin, productController.findById)
router.get('/findByCompanyName', middleware.isAuthencticated, isAdmin, productController.findByCompanyName)
router.patch('/findByIdAndUpdate/:id', validation.productValidaiton.update, middleware.isAuthencticated, isAdmin,productController.findByIdandUpdate)
router.delete('/findByIdAndDelete/:id',  middleware.isAuthencticated, isAdmin, productController.findByIdandDelete)


module.exports = router






