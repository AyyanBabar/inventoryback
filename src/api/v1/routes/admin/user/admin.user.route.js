const router = require('express').Router()
const userAdminController = require('../../../controller/admin/user/admin.controller')
const validation = require('../../../../../common/validations/admin/index')
const middleware = require('../../../../../middleware/index')

router.post('/create', validation.userValidation.create, middleware.isAuthencticated, middleware.isAdmin,  userAdminController.create)
router.get('/find',  middleware.isAuthencticated, middleware.isAdmin,  userAdminController.find)
router.delete('/delete/:id',  middleware.isAuthencticated, middleware.isAdmin,  userAdminController.delete)
router.get('/getusers',  middleware.isAuthencticated, middleware.isAdmin,  userAdminController.getallusers)
router.get('/getcompanies',  middleware.isAuthencticated, middleware.isAdmin,  userAdminController.getallcompanies)



module.exports = router 