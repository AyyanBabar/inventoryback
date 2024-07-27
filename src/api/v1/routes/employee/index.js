const router = require("express").Router();

const employee = require("../employee/employee.route")

router.use('/employee', employee)

module.exports = router