const router = require("express").Router();
const companyController = require('../../../controller/company/company.controller')
const validation = require('../../../../../common/index')
const middleware = require('../../../../../middleware')

router.post('/create', validation.companyValidation.create, middleware.isAuthencticated, companyController.create)
router.get('/getAllCompanies', middleware.isAuthencticated, companyController.get)
// router.get('/getById/:id', middleware.isAuthencticated, companyController.findById)
router.patch('/findByIdAndUpdate/:id',validation.companyValidation.update, middleware.isAuthencticated, companyController.findByIdandUpdate)
router.delete('/findByIdAndDelete/:id',  middleware.isAuthencticated, companyController.findByIdandDelete)

module.exports = router




