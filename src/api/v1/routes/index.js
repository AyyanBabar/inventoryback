const router = require("express").Router();
const auth = require('./auth/auth.routes')
const company = require('./company/company.routes')

router.use('/auth', auth)
router.use('/company', company)
module.exports = router