const express = require("express")
const router = express.Router();
const batchSearch = require("./batchsearch.route")


router.use('/searchbybatchID', batchSearch);

module.exports = router