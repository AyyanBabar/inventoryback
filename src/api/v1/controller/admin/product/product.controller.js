const db = require('../../../../../Database/database.config')
const ApiResponse = require('../../../../../Response/api.resposne')
const { validationResult } = require("express-validator");


const productController = {}

productController.create = (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return ApiResponse(res, 404, { status: false, msg: 'Invalid input', data: errors.array() });
    }

    db.query('SELECT * FROM users WHERE userId = ?', [req.user.userId], (error, findUser) => {
        if (error) {
            console.error('Database query error:', error);
            return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
        }
        if (findUser.length === 0) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null });
        }

        db.query('SELECT * FROM company WHERE companyId = ?', [req.body.companyId], (error, company) => {
            if (error) {
                console.error('Database query error:', error);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
            }
            if (company.length === 0) {
                return ApiResponse(res, 404, { status: false, msg: 'Company does not exist', data: null });
            }

            db.query('SELECT * FROM product WHERE companyId = ? AND productName = ?', [req.body.companyId, req.body.productName], (error, existingProduct) => {
                if (error) {
                    console.error('Database query error:', error);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
                }
                if (existingProduct.length > 0) {
                    return ApiResponse(res, 404, { status: false, msg: 'Product already exists', data: null });
                }

                const newProductData = {
                    userId: req.user.userId,
                    companyId: req.body.companyId,
                    productName: req.body.productName,
                    issueDate: req.body.issueDate
                };

                db.query('INSERT INTO product SET ?', newProductData, (error, result) => {
                    if (error) {
                        console.error('Database query error:', error);
                        return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
                    }
                    return ApiResponse(res, 200, { status: true, msg: 'Product created successfully', data: newProductData });
                });
            });
        });
    });
};
productController.find = (req, res) => {
    db.query('SELECT * FROM users WHERE userId = ?', [req.user.userId], (error, findUser) => {
        if (error) {
            console.error('Database query error:', error);
            return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
        }
        if (findUser.length === 0) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null });
        }

        db.query('select p.productId, p.userId, p.companyId, c.companyName, p.productName, p.issueDate from product as p inner join company as c on p.companyId = c.companyId order by productId;', (error, findProduct) => {
            if (error) {
                console.error('Database query error:', error);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
            }
            if (findProduct.length === 0) {
                return ApiResponse(res, 404, { status: false, msg: 'No products found', data: null });
            }

            return ApiResponse(res, 200, { status: true, msg: 'Products retrieved successfully', data: findProduct });
        });
    });
};
// productController.create = async (req, res) => {
//     try {
//         const errors = validationResult(req)
//         if (!errors.isEmpty()) {
//             return ApiResponse(res, 404, { status: false, msg: 'Invalid input', data: errors.array() })
//         }
//         const findUser = await User.findById(req.user._id)
//         if (!findUser) {
//             return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
//         }
//         const company = await Company.findOne({ _id: req.body.companyId })
//         if (!company) {
//             return ApiResponse(res, 404, { status: false, msg: 'company dont exist', data: null })

//         }
//         const existingProduct = await Product?.findOne({ companyId: company._id, productName: req.body.productName })
//         if (existingProduct) {
//             return ApiResponse(res, 404, { status: false, msg: ' product already exist', data: null })
//         }
//         const newProductData = {
//             userId: req.user._id,
//             companyId: company._id,
//             companyName: company.companyName,
//             productName: req.body.productName,
//             issueDate: req.body.issueDate
//         };

//         const newProduct = await Product.create(newProductData)
//         return ApiResponse(res, 200, { status: true, msg: 'Product created Succesfully', data: newProduct })
//     } catch (err) {

//         console.log(err)
//         return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
//     }
// }
// productController.find = async (req, res) => {
//     try {
//         const findUser = await User.findById(req.user._id)
//         if (!findUser) {
//             return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
//         }
//         const findProduct = await Product.find()
//         if (findProduct.length <= 0) {
//             return ApiResponse(res, 404, { status: false, msg: 'No product is associated with this user', data: null })
//         }

//         return ApiResponse(res, 200, { status: true, msg: 'Product', data: findProduct })
//     } catch (err) {

//         console.log(err)
//         return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
//     }
// }
// productController.findByCompanyName = async (req, res) => {
//     try {
//         console.log(req.query.companyName)
//         const findUser = await User.findById(req.user._id)
//         if (!findUser) {
//             return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
//         }
//         console.log(findUser)

//         const findProduct = await Product.find({  companyName: req.query.companyName })
//         console.log(findProduct)
//         if (findProduct <= 0) {
//             return ApiResponse(res, 404, { status: false, msg: 'No product is associated with this company', data: null })
//         }
//         return ApiResponse(res, 200, { status: true, msg: 'Product', data: findProduct })
//     } catch (err) {

//         console.log(err)
//         return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
//     }
// }
// productController.findById = async (req, res) => {
//     try {
//         console.log(req.params.id)
//         const findUser = await User.findById(req.user._id)
//         if (!findUser) {
//             return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
//         }
//         const product = await Product.findOne({ _id: req.params.id})
//         if (!product) {
//             return ApiResponse(res, 404, { status: false, msg: 'Product not found', data: null });
//         }
//         return ApiResponse(res, 200, { status: true, msg: 'Product found', data: product });
//     } catch (err) {
//         return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
//     }
// }


// productController.findByIdandUpdate = async (req, res) => {
//     try {
//         const errors = validationResult(req)
//         console.log(req.body)
//         if (!errors.isEmpty()) {
//             return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() })
//         }
//         const findUser = await User.findById(req.user._id)
//         if (!findUser) {
//             return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
//         }
//         if (req.body.companyName) {
//             const findCompany = await Company.findOne({companyName: req.body.companyName })
//             if (!findCompany) {
//                 return ApiResponse(res, 400, { status: false, msg: 'compnay dont exist', data: null })
//             }
//         }
//         const findProduct = await Product.findOne({ _id: req.params.id })
//         if (!findProduct) {
//             return ApiResponse(res, 400, { status: false, msg: 'prodcut dont exist', data: null })
//         }
//         if (req.body.companyName) findProduct.companyName = req.body.companyName;
//         if (req.body.productName) findProduct.productName = req.body.productName;
//         if (req.body.issueDate) findProduct.issueDate = req.body.issueDate;

//         await findProduct.save()

//         return ApiResponse(res, 200, { status: true, msg: 'Company found', data: findProduct });
//     } catch (err) {
//         return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
//     }
// }
productController.findByIdandUpdate = (req, res) => {
    const errors = validationResult(req);
    console.log(req.body);
    if (!errors.isEmpty()) {
        return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() });
    }

    const userId = req.user.userId;
    const productId = req.params.id;
    const {productName, issueDate } = req.body;

    db.query('SELECT * FROM users WHERE userId = ?', [userId], (error, findUser) => {
        if (error) {
            console.error('Database query error:', error);
            return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
        }
        if (findUser.length === 0) {
            return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null });
        }
        db.query('update product set productName = ?, issueDate = ? where productId = ?', [productName, issueDate, productId], (error, data)=>{
            if(error){
                console.error('Database query error:', error);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
            }
            if(!error){
                return ApiResponse(res, 200, { status: true, msg: 'Product updated successfully', data: data });
            }
        });
    });
};
productController.findByIdandDelete = async (req, res) => {
    try {
        const findUserQuery = "SELECT * FROM users WHERE userId = ?";
        db.query(findUserQuery, [req.user.userId], (userError, findUser) => {
            if (userError) {
                console.error('Database query error:', userError);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: userError });
            }
            if (findUser.length === 0) {
                return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null });
            }

            const findProductQuery = "SELECT * FROM product WHERE productId = ?";
            db.query(findProductQuery, [req.params.id], (productError, findProduct) => {
                if (productError) {
                    console.error('Database query error:', productError);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: productError });
                }
                if (findProduct.length === 0) {
                    return ApiResponse(res, 404, { status: false, msg: 'Product not found', data: null });
                }

                const deleteProductQuery = "DELETE FROM product WHERE productId = ?";
                db.query(deleteProductQuery, [req.params.id], (deleteError, deleteResult) => {
                    if (deleteError) {
                        console.error('Database query error:', deleteError);
                        return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: deleteError });
                    }

                    return ApiResponse(res, 200, { status: true, msg: 'Product deleted successfully', data: null });
                });
            });
        });
    } catch (err) {
        console.error('Internal Server Error:', err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
    }
};



module.exports = productController