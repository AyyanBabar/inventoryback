const router = require('express').Router()
const authController = require('../../controller/auth/auth.controller')
const validation = require('../../../../common/index')

router.post('/register', validation.userModule.register, authController.register)
router.post('/login', validation.userModule.login   , authController.login)

module.exports = router