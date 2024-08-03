const router = require("express").Router();
const employeecontroller = require('../../controller/employee/employee.controller')
const middleware = require('../../../../middleware');

router.post('/associate', middleware.isAuthencticated, employeecontroller.associate)
router.get('/getcompany', middleware.isAuthencticated, employeecontroller.getcompany)
router.get('/fetchproducts', middleware.isAuthencticated, employeecontroller.fetchProducts)
router.get('/fetchbatches', middleware.isAuthencticated, employeecontroller.fetchbatches)
router.get('/fetchsales', middleware.isAuthencticated, employeecontroller.fetchbatchsales)


module.exports = router