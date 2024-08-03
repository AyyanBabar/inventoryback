const ApiResponse = require('../../../../Response/api.resposne')
const db = require('../../../../Database/database.config')

const vendorsaleBatchController = {}

vendorsaleBatchController.find = async (req, res) => {
    try {
        db.query('select * from batch_sale where userId = ?',[req.user.userId], (err, findBatches)=>{
            if(err){
                console.error('Database query error:', err);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
            }
            if(findBatches.length === 0){
                return ApiResponse(res, 404, { status: false, msg: 'No Batch Sales Found', data: findBatches });
            }
            return ApiResponse(res, 200, { status: true, msg: 'Batches Retrived', data: findBatches })
        });
    } catch (err) {

        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}

module.exports = vendorsaleBatchController