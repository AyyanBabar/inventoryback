const router = require('express').Router()
const authController = require('../../controller/auth/auth.controller')
const validation = require('../../../../common/index')

router.post('/register', validation.userModule.register, authController.register)

module.exports = router