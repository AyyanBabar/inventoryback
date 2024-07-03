const router = require("express").Router();
const batchsearchcontroller = require('../../controller/public/batchsearchcontroller');

router.post('/:id', batchsearchcontroller.find);

module.exports = router