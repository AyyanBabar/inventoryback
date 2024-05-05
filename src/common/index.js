const ProductBatches = require('../model/product_batches.model');

module.exports = {
    userValidation: require('./validations/auth.validation'),
    companyValidation :  require('./validations/company.validation'),
    productValidaiton: require('./validations/product.validaiton'),
    productBatchValdataion: require('./validations/product_batches.validation'),
    batchSales: require('./validations/batch_sales.validation')
}