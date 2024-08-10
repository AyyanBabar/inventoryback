const ApiResponse = require('../../../../Response/api.resposne')
const { validationResult } = require("express-validator");
const db = require('../../../../Database/database.config')

const prodcutBatchController = {}

prodcutBatchController.create = async (req, res) => {
    try {
        // Check for validation errors
        // const errors = validationResult(req);
        // if (!errors.isEmpty()) {
        //     return ApiResponse(res, 404, { status: false, msg: 'Invalid input', data: errors.array() });
        // }
        // Query to find the user by userId
        const findUserQuery = "SELECT * FROM users WHERE userId = ?";
        db.query(findUserQuery, [req.user.userId], (err, findUser) => {
            if (err) {
                console.error('Database query error:', err);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
            }
            if (findUser.length === 0) {
                return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null });
            }
            // Query to find the product by productId
            const findProductQuery = "SELECT * FROM product WHERE productId = ?";
            db.query(findProductQuery, [req.body.productId], (err, findProduct) => {
                if (err) {
                    console.error('Database query error:', err);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                }
                if (findProduct.length === 0) {
                    return ApiResponse(res, 404, { status: false, msg: 'Product not found', data: null });
                }
                // Query to find the highest batch number for the product
                const findBatchNumbersQuery = "SELECT batchNo FROM product_batch WHERE productId = ? ORDER BY batchNo DESC LIMIT 1";
                db.query(findBatchNumbersQuery, [req.body.productId], (err, findBatchNumbers) => {
                    if (err) {
                        console.error('Database query error:', err);
                        return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                    }
                    let batchNumber = 1;
                    if (findBatchNumbers.length > 0) {
                        batchNumber = findBatchNumbers[0].batchNo + 1;
                    }
                    // Insert new batch data
                    const newBatchData = {
                        batchNo: batchNumber,
                        quantity: req.body.quantity,
                        remainingQuantity: req.body.quantity,
                        productionDate: req.body.productionDate,
                        userId : req.user.userId,
                        productId: req.body.productId,
                    };
                    const insertBatchQuery = "INSERT INTO product_batch (batchNo, quantity, remainingQuantity, productionDate, userId, productId) VALUES (?, ?, ?, ?, ?, ?)";
                    db.query(insertBatchQuery, [newBatchData.batchNo, newBatchData.quantity, newBatchData.remainingQuantity, newBatchData.productionDate, newBatchData.userId, newBatchData.productId], (err, result) => {
                        if (err) {
                            console.error('Database query error:', err);
                            return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                        }
                        return ApiResponse(res, 200, { status: true, msg: 'Batch created successfully', data: null });
                    });
                });
            });
        });
    } catch (err) {
        console.log(err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
    }
};
prodcutBatchController.find = async (req, res) => {
    try {
        // Check if the user exists
        const findUserQuery = "SELECT * FROM users WHERE userId = ?";
        db.query(findUserQuery, [req.user.userId], (err, findUser) => {
            if (err) {
                console.error('Database query error:', err);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
            }
            if (findUser.length === 0) {
                return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null });
            }
            // Retrieve all product batches
            const productBatchesQuery = "SELECT * FROM product_batch";
            db.query(productBatchesQuery, (err, productBatches) => {
                if (err) {
                    console.error('Database query error:', err);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                }
                return ApiResponse(res, 200, { status: true, msg: 'Product Batches retrieved successfully', data: productBatches });
            });
        });
    } catch (err) {
        console.error('Server error:', err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
    }
};

prodcutBatchController.findByProductId = async (req, res) => {
    try {
        db.query("select * from product_batch where productId = ?",[req.params.id], (err, batches)=>{
            if(err){
                console.error('Database query error:', err);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
            }
            if(batches.length === 0){
                return ApiResponse(res, 404, { status: false, msg: 'No Product Batch existed for this product', data: batches});
            }
            return ApiResponse(res, 200, { status: true, msg: 'Batches Retrived Successfully', data: batches});
        });

    } catch (err) {
        console.error(err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
    }
}
// prodcutBatchController.findById = async (req, res) => {
//     try {
//         const findUser = await User.findById(req.user._id)
//         if (!findUser) {
//             return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
//         }
//         const findProductBatch = await prodcutBatch.findById(req.params.id)

//         if (!findProductBatch) {
//             return ApiResponse(res, 404, { status: false, msg: 'productBatchNotfound', data: null })
//         }

//         const findProduct = await Product.findById(findProductBatch.productId)

//         if (req.user._id != findProduct.userId) {
//             return ApiResponse(res, 404, { status: false, msg: 'productBatch  found', data: null })
//         }

//         return ApiResponse(res, 200, { status: true, msg: 'Batch found', data: findProductBatch })

//     } catch (err) {
//         console.log(err)
//         return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })

//     }

// }
// prodcutBatchController.findByIdandUpdate = async (req, res) => {
//     try {
//         if (!req.user) {
//             return ApiResponse(res, 400, { status: false, msg: 'Invalid user', data: null })

//         }
//         const errors = validationResult(req)
//         console.log(req.body)
//         if (!errors.isEmpty()) {
//             return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() })
//         }
//         const findUser = await User.findById(req.user._id)
//         if (!findUser) {
//             return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
//         }

//         const findProductBatch = await prodcutBatch.findById(req.params.id)

//         if (!findProductBatch) {
//             return ApiResponse(res, 404, { status: false, msg: 'productBatchNotfound', data: null })
//         }

//         const findProduct = await Product.findById(findProductBatch.productId)

        

//         if (req.body.quantity){
//             findProductBatch.quantity = req.body.quantity;
//             // findProductBatch.remainingQuantity = req.body.quantity
//         }
//         // if (req.body.data) findProductBatch.data = req.body.data;

//         await findProductBatch.save()

//         return ApiResponse(res, 200, { status: true, msg: 'udpated', data: findProductBatch });
//     } catch (err) {
//         return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
//     }
// }
prodcutBatchController.findByIdandUpdate = (req, res) => {
    try {
        // Check if the user is valid
        if (!req.user) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid user', data: null });
        }
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() });
        }
        // Check if the user exists
        const findUserQuery = "SELECT * FROM users WHERE userId = ?";
        db.query(findUserQuery, [req.user.userId], (err, findUser) => {
            if (err) {
                console.error('Database query error:', err);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
            }
            if (findUser.length === 0) {
                return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null });
            }
            // Check if the product batch exists
            const findProductBatchQuery = "SELECT * FROM product_batch WHERE productBatchId = ?";
            db.query(findProductBatchQuery, [req.params.id], (err, findProductBatch) => {
                if (err) {
                    console.error('Database query error:', err);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                }
                if (findProductBatch.length === 0) {
                    return ApiResponse(res, 404, { status: false, msg: 'Product Batch not found', data: null });
                }
                let remainingQuantity = 0
                if(findProductBatch[0].quantity == findProductBatch[0].remainingQuantity)
                {
                    remainingQuantity = parseInt(req.body.quantity)
                    console.log("Case 1");
                }
                else if(parseInt(req.body.quantity)<findProductBatch[0].remainingQuantity){
                    return ApiResponse(res, 404, { status: false, msg: 'Updated quantity is less than remaining quantity', data: null });
                    console.log("Case 2");
                }   
                else if(parseInt(req.body.quantity)>findProductBatch[0].remainingQuantity)
                {
                    remainingQuantity = findProductBatch[0].remainingQuantity+ (parseInt(req.body.quantity) - findProductBatch[0].quantity);
                    console.log("Case 3");
                }
                // Update product batch details
                let updateFields = [];
                let updateValues = [];
                remainingQuantity = findProductBatch[0].remainingQuantity+ (parseInt(req.body.quantity) - findProductBatch[0].quantity);

                if(req.body.quantity) {
                    updateFields.push("quantity = ?");
                    updateFields.push("remainingQuantity = ?");
                    updateValues.push(req.body.quantity);
                    updateValues.push(remainingQuantity);
                    // updateValues.push(findProductBatch.productBatchId);
                }
                if (updateFields.length > 0) {
                    updateValues.push(req.params.id);
                    const updateProductBatchQuery = `UPDATE product_batch SET ${updateFields.join(", ")} WHERE productBatchId = ?`;

                    db.query(updateProductBatchQuery, updateValues, (err, result) => {
                        if (err) {
                            console.error('Database query error:', err);
                            return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                        }

                        return ApiResponse(res, 200, { status: true, msg: 'Product Batch updated successfully', data: null });
                    });
                } else {
                    return ApiResponse(res, 400, { status: false, msg: 'No data to update', data: null });
                }
            
            });
        });
    } catch (err) {
        console.error('Server error:', err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
    }
};
prodcutBatchController.findByIdandDelete = (req, res) => {
    try {
        // Check if the user is valid
        if (!req.user) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid user', data: null });
        }
        // Validate request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() });
        }
        // Check if the user exists
        const findUserQuery = "SELECT * FROM users WHERE userId = ?";
        db.query(findUserQuery, [req.user.userId], (err, findUser) => {
            if (err) {
                console.error('Database query error:', err);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
            }
            if (findUser.length === 0) {
                return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null });
            }
            // Check if the product batch exists
            const findProductBatchQuery = "SELECT * FROM product_batch WHERE productBatchId = ?";
            db.query(findProductBatchQuery, [req.params.id], (err, findProductBatch) => {
                if (err) {
                    console.error('Database query error:', err);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                }
                if (findProductBatch.length === 0) {
                    return ApiResponse(res, 404, { status: false, msg: 'Product Batch not found', data: null });
                }
                // Delete the product batch
                const deleteProductBatchQuery = "DELETE FROM product_batch WHERE productBatchId = ?";
                db.query(deleteProductBatchQuery, [req.params.id], (err, result) => {
                    if (err) {
                        console.error('Database query error:', err);
                        return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                    }
                    return ApiResponse(res, 200, { status: true, msg: 'Batch deleted successfully', data: null });
                });
            });
        });
    } catch (err) {
        console.error('Server error:', err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
    }
};



module.exports = prodcutBatchController
