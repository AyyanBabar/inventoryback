const ApiResponse = require('../../../../Response/api.resposne')
const { validationResult } = require("express-validator");
const db = require('../../../../Database/database.config')

const batchSearchController = {}

batchSearchController.find = async (req, res) =>{
    try{
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() })
        }
        // console.log(req.body)
        const {id} = req.params;
        console.log(id)
        db.query("select b.productId, p.productName, b.remainingQuantity, b.productionDate from product_batch as b inner join product as p on b.productId = p.productId where b.productBatchId = ?", [id], (err, batchFound)=>{
            if (err) {
                console.error('Database query error:', err);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
            }
            if(batchFound.length === 0){
                return ApiResponse(res, 404, { status: false, msg: 'No Product Batch exist', data: batchFound });
            }
            return ApiResponse(res, 200, { status: true, msg: 'Product Batch Found', data: batchFound });
        });
       
    }
    catch (err) {
        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })

    }
}

module.exports = batchSearchController