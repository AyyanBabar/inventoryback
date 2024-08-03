const ApiResponse = require('../../../../Response/api.resposne')
const { validationResult } = require("express-validator");
const db = require('../../../../Database/database.config')

const productController = {}


productController.create = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array()})
        }
        db.query("select * from product where companyId = ? and productName = ?", [req.body.companyId, req.body.productName], (error, product)=>{
            if(error){
                console.error('Database query error:', error);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
            }
            if(product.length>0){
                return ApiResponse(res, 404, { status: false, msg: ' Product already exist', data: null })
            }
            db.query("insert into product (productName, issueDate, userId, companyId) values (?,?,?,?)", [req.body.productName, req.body.issueDate, req.user.userId, req.body.companyId], (error, insertedProduct)=>{
                if(error){
                    console.error('Database query error:', error);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
                }
                return ApiResponse(res, 200, { status: true, msg: 'Product created Succesfully', data: insertedProduct})
            });
        });
    } catch (err) {
        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}
// productController.find = async (req, res) => {
//     try {
//         const findUser = await User.findById(req.user._id)
//         if (!findUser) {
//             return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
//         }
//         const findProduct = await Product.find({ userId: req.user._id })
//         if (findProduct.length <= 0) {
//             return ApiResponse(res, 404, { status: false, msg: 'No product is associated with this user', data: null })
//         }

//         return ApiResponse(res, 200, { status: true, msg: 'Product', data: findProduct })
//     } catch (err) {

//         console.log(err)
//         return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
//     }
// }
productController.findByCompanyName = async (req, res) => {
    try {
        db.query("select p.productId, p.productName,p.issueDate,p.userId,p.companyId, c.companyName from product as p inner join company as c on p.companyId = c.companyId where p.companyId = ?",[req.params.id], (error, products)=>{
            if(error){
                console.error('Database query error:', error);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
            }
            if(products.length === 0){
                return ApiResponse(res, 404, { status: false, msg: 'No product is associated with this company', data: null });
            }
            return ApiResponse(res, 200, { status: true, msg: 'Product Retrived', data: products})
        });
    } catch (err) {
        console.log(err)
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}
// productController.findById = async (req, res) => {
//     try {
//         console.log(req.params.id)
//         const findUser = await User.findById(req.user._id)
//         if (!findUser) {
//             return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
//         }
//         const product = await Product.findOne({ _id: req.params.id, userId: req.user._id })
//         if (!product) {
//             return ApiResponse(res, 404, { status: false, msg: 'Product not found', data: null });
//         }
//         return ApiResponse(res, 200, { status: true, msg: 'Product found', data: product });
//     } catch (err) {
//         return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
//     }
// }
productController.findByIdandUpdate = async (req, res) => {
    try {
        db.query("update product set productName = ?, issueDate = ? where productId = ?",[req.body.productName, req.body.issueDate, req.params.id], (error)=>{
            if(error){
                console.error('Database query error:', error);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
            }
            return ApiResponse(res, 200, { status: true, msg: 'Product Updated Successfully', data: null});
        });
    } catch (err) {
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}
productController.findByIdandDelete = async (req, res) => {
    try {
        db.query("select * from product where productId = ? and userId = ?", [req.params.id, req.user.userId], (error, findProduct)=>{
            if(error){
                console.error('Database query error:', error);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
            }
            if(findProduct.lenght === 0)
            {
                return ApiResponse(res, 404, { status: false, msg: 'Product not found', data: null })
            }
            db.query("delete from product where productId = ?", [req.params.id], (error)=>{
                if(error){
                    console.error('Database query error:', error);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
                }
                return ApiResponse(res, 200, { status: true, msg: 'Product Deleted Successfully', data: null });
            });
        });
    } catch (err) {
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
    }
}


module.exports = productController