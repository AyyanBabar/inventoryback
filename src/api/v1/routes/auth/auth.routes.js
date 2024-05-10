const router = require('express').Router()
const authController = require('../../controller/auth/auth.controller')
const validation = require('../../../../common/index')
const middleware = require('../../../../middleware')

router.post('/register', validation.userValidation.register, authController.register)
router.post('/login', validation.userValidation.login, authController.login)
router.get('/verify',  authController.verify)
router.post('/forget-password', authController.forgetpassowrd)
router.get('/reset-password/:id/:token/:password', authController.resetPassword)

module.exports = router 