const ApiResponse = require('../../../../Response/api.resposne')
const db = require('../../../../Database/database.config');

const employeeController = {}

employeeController.associate = async (req, res) => {
    try {
        db.query("update users set role = 'employee' where userId = ?", [req.body.userId], (error)=>{
            if (error) {
                console.error('Database query error:', error);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
            }
            db.query("insert into employee(userId, companyId) values (?,?)", [req.body.userId, req.body.companyId], (error)=>{
                if (error) {
                    console.error('Database query error:', error);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
                }
                return ApiResponse(res, 200, { status: true, msg: 'Employee Associated Succesfully', data: null })
            });
        });
    } catch (err) {
        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })

    }
}
employeeController.getcompany = async (req, res) => {
    try{
        db.query("select c.companyName from employee as e inner join company as c on e.companyId = c.companyId where e.userId = ?", [req.user.userId], (error, company)=>{
            if (error) {
                console.error('Database query error:', error);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
            }
            return ApiResponse(res, 200, { status: true, msg: 'Company Found', data: company })
        });
        
    }
    catch (err){ 
        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}
employeeController.fetchProducts = async (req, res) => {
    try {
        db.query("select p.*, c.companyName  from employee as e inner join product as p on e.companyId = p.companyId inner join company as c on p.companyId = c.companyId where e.userId = ?", [req.user.userId], (error, product)=>{
            if (error) {
                console.error('Database query error:', error);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
            }
            if(product.length === 0){
                return ApiResponse(res, 404, { status: false, msg: 'No Product is associated with this company', data: product });
            }
            return ApiResponse(res, 200, { status: true, msg: 'Product Found', data: product })
        });
    } catch (err) {
        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}
employeeController.fetchbatches = async (req, res) => {
    try {
        db.query("select b.* from employee as e inner join product as p on e.companyId = p.companyId inner join product_batch as b on p.productId = b.productId where e.userId = ?", [req.user.userId], (error, batches)=>{
            if (error) {
                console.error('Database query error:', error);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
            }
            if(batches.length ===0){
                return ApiResponse(res, 404, { status: false, msg: 'No Product Batches Found', data: batches });
            }
            return ApiResponse(res, 200, { status: true, msg: 'Product Batch retrieved successfully', data: batches });
        }); 
    } catch (err) {
        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}
employeeController.fetchbatchsales = async (req, res) => {
    try {
        db.query("select s.* from employee as e inner join product as p on e.companyId = p.companyId inner join product_batch as b on p.productId = b.productId inner join batch_sale as s on b.productBatchId = s.productBatchId where e.userId = ?", [req.user.userId], (error, batchSales)=>{
            if (error) {
                console.error('Database query error:', error);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
            }
            if(batchSales.length ===0){
                return ApiResponse(res, 404, { status: false, msg: 'No Product Batches Found', data: batchSales });
            }
            return ApiResponse(res, 200, { status: true, msg: 'Product Batch retrieved successfully', data: batchSales });
        }); 
    } catch (err) {
        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}

module.exports = employeeController