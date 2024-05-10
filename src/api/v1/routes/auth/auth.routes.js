const router = require('express').Router()
const authController = require('../../controller/auth/auth.controller')
const validation = require('../../../../common/index')
const middleware = require('../../../../middleware')

router.post('/register', validation.userValidation.register, authController.register)
router.post('/login', validation.userValidation.login, authController.login)
router.get('/verify',  authController.verify)

module.exports = router 