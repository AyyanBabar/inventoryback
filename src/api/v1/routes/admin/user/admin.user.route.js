const router = require('express').Router()
const userAdminController = require('../../../controller/admin/user/admin.controller')
const validation = require('../../../../../common/validations/admin/index')
const middleware = require('../../../../../middleware/index')

router.post('/create', validation.userValidation.create, middleware.isAuthencticated, middleware.isAdmin,  userAdminController.create)
router.get('/find',  middleware.isAuthencticated, middleware.isAdmin,  userAdminController.find)
router.delete('/delete/:id',  middleware.isAuthencticated, middleware.isAdmin,  userAdminController.delete)



module.exports = router 