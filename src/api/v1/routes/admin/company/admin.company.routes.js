const router = require('express').Router()
const companyAdminController = require('../../../controller/admin/company/admin.comapny.controller')
const validation = require('../../../../../common/index')
const middleware = require('../../../../../middleware');

router.post('/create', validation.companyValidation.create, middleware.isAuthencticated, middleware.isAdmin,  companyAdminController.create)
router.get('/find',  middleware.isAuthencticated, middleware.isAdmin, companyAdminController.get)
router.get('/getById/:id', middleware.isAuthencticated, middleware.isAdmin, companyAdminController.findById)
router.patch('/findByIdAndUpdate/:id',validation.companyValidation.update, middleware.isAuthencticated, middleware.isAdmin, companyAdminController.findByIdandUpdate)
router.delete('/findByIdAndDelete/:id',  middleware.isAuthencticated, middleware.isAdmin, companyAdminController.findByIdandDelete)




module.exports = router 