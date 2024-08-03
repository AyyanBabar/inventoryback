// const prodcutBatch = require('../../../../../model/product_batches.model')
// const User = require('../../../../../model/index').user
// const batchSales = require('../../../../../model/index').batchSales
// const Employee = require('../../../../../model/employee.model')
// const Product = require('../../../../../model/index').product
// const { ObjectId, MongoGridFSChunkError } = require('mongodb');
// const mongoose = require('mongoose')
const db = require('../../../../../Database/database.config')
const ApiResponse = require('../../../../../Response/api.resposne')
const { validationResult } = require("express-validator");

const batchSalesController = {}

batchSalesController.create = async (req, res) => {
    try {
        const findUserQuery = "SELECT * FROM users WHERE userId = ?";
        db.query(findUserQuery, [req.user.userId], (err, findUser) => {
            if (err) {
                console.error('Database query error:', err);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
            }
            if (findUser.length === 0) {
                return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null });
            }
            const userId = findUser[0].userId;
            // Check if the product batch exists
            const findProductBatchQuery = "SELECT * FROM product_batch WHERE productBatchId = ?";
            db.query(findProductBatchQuery, [req.body.productBatchId], (err, findProductBatch) => {
                if (err) {
                    console.error('Database query error:', err);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                }
                if (findProductBatch.length === 0) {
                    return ApiResponse(res, 404, { status: false, msg: 'Product Batch not found', data: null });
                }
                const productBatchId = findProductBatch[0].productBatchId;
                // Check if the product exists
                const findProductQuery = "SELECT * FROM product WHERE productId = ?";
                db.query(findProductQuery, [findProductBatch[0].productId], (err, findProduct) => {
                    if (err) {
                        console.error('Database query error:', err);
                        return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                    }
                    if (findProduct.length === 0) {
                        return ApiResponse(res, 404, { status: false, msg: 'Product not found', data: null });
                    }
                    // Check if the sold quantity is more than the remaining quantity
                    if (parseInt(req.body.soldQuantity) > findProductBatch[0].remainingQuantity) {
                        return ApiResponse(res, 404, { status: false, msg: 'Not enough remaining products available for this sale', data: null });
                    }
                    const dateOfSale = new Date(req.body.dateOfSale);
                    const dateOfProduction = new Date(findProductBatch[0].productionDate);
                    if (dateOfSale < dateOfProduction) {
                        return ApiResponse(res, 404, { status: false, msg: 'Date of Sale cannot be earlier than Date of Production', data: null });                                    }
                    // Insert new batch sale data
                    const newBatchSalesQuery = `
                        INSERT INTO batch_sale(soldQuantity, dateOfSale, productBatchId, userId)
                        VALUES (?, ?, ?, ?)
                    `;
                    db.query(newBatchSalesQuery, [req.body.soldQuantity, req.body.dateOfSale, productBatchId, req.user.userId], (err, newBatchSale) => {
                        if (err) {
                            console.error('Database query error:', err);
                            return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                        }
                        // Update the remaining quantity in the product batch
                        const updateRemainingQuantityQuery = `
                            UPDATE product_batch
                            SET remainingQuantity = remainingQuantity - ?
                            WHERE productBatchId = ?
                        `;
                        db.query(updateRemainingQuantityQuery, [req.body.soldQuantity, productBatchId], (err, result) => {
                            if (err) {
                                console.error('Database query error:', err);
                                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                            }
                            return ApiResponse(res, 200, { status: true, msg: 'Batch created successfully', data: newBatchSale });
                        });
                    });
                });
            });
        });
    } catch (err) {
        console.error('Server error:', err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
    }
};
batchSalesController.find = async (req, res) => {
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
            // Fetch all batch sales
            const findProductBatchQuery = "SELECT * FROM batch_sale";
            db.query(findProductBatchQuery, (err, findProductBatch) => {
                if (err) {
                    console.error('Database query error:', err);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                }
                return ApiResponse(res, 200, { status: true, msg: 'Batch Sales retrieved successfully', data: findProductBatch });
            });
        });
    } catch (err) {
        console.error('Server error:', err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
    }
};
batchSalesController.findById = async (req, res) => {
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
            
            // Find the specific batch sale by ID
            const findBatchSalesQuery = "SELECT * FROM batch_sale WHERE batchSaleId = ?";
            db.query(findBatchSalesQuery, [req.params.id], (err, findBatchSales) => {
                if (err) {
                    console.error('Database query error:', err);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                }
                if (findBatchSales.length === 0) {
                    return ApiResponse(res, 404, { status: false, msg: 'Batch Sale not found', data: null });
                }

                // Find the related product batch
                const findProductBatchQuery = "SELECT * FROM product_batch WHERE productBatchId = ?";
                db.query(findProductBatchQuery, [findBatchSales[0].productBatchId], (err, findProductBatch) => {
                    if (err) {
                        console.error('Database query error:', err);
                        return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                    }
                    if (findProductBatch.length === 0) {
                        return ApiResponse(res, 404, { status: false, msg: 'Product Batch not found', data: null });
                    }
                    // Find the product related to the product batch
                    const findProductQuery = "SELECT * FROM product WHERE productId = ?";
                    db.query(findProductQuery, [findProductBatch[0].productId], (err, findProduct) => {
                        if (err) {
                            console.error('Database query error:', err);
                            return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                        }
                        if (findProduct.length === 0) {
                            return ApiResponse(res, 404, { status: false, msg: 'Product not found', data: null });
                        }
                        // Respond with the batch sale details
                        return ApiResponse(res, 200, { status: true, msg: 'Batch Sale found', data: findBatchSales[0] });
                    });
                });
            });
        });
    } catch (err) {
        console.error('Server error:', err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
    }
};
batchSalesController.findByIdandUpdate = async (req, res) => {
    try {
        // Check if the user exists
        if (!req.user) {
            return ApiResponse(res, 404, { status: false, msg: 'Invalid user', data: null });
        }
        // Validate the request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiResponse(res, 404, { status: false, msg: 'Invalid input', data: errors.array() });
        }
        // Find the user
        const findUserQuery = "SELECT * FROM users WHERE userId = ?";
        db.query(findUserQuery, [req.user.userId], (err, findUser) => {
            if (err) {
                console.error('Database query error:', err);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
            }
            if (findUser.length === 0) {
                return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null });
            }
            // Find the specific batch sale by ID
            const findBatchSalesQuery = "SELECT * FROM batch_sale WHERE batchSaleId = ?";
            db.query(findBatchSalesQuery, [req.params.id], (err, findBatchSales) => {
                if (err) {
                    console.error('Database query error:', err);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                }
                if (findBatchSales.length === 0) {
                    return ApiResponse(res, 404, { status: false, msg: 'Batch Sale not found', data: null });
                }
                // Find the related product batch
                const findProductBatchQuery = "SELECT * FROM product_batch WHERE productBatchId = ?";
                db.query(findProductBatchQuery, [findBatchSales[0].productBatchId], (err, findProductBatch) => {
                    if (err) {
                        console.error('Database query error:', err);
                        return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                    }
                    if (findProductBatch.length === 0) {
                        return ApiResponse(res, 404, { status: false, msg: 'Product Batch not found', data: null });
                    }
                    // Find the product related to the product batch
                    const findProductQuery = "SELECT * FROM product WHERE productId = ?";
                    db.query(findProductQuery, [findProductBatch[0].productId], (err, findProduct) => {
                        if (err) {
                            console.error('Database query error:', err);
                            return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                        }
                        if (findProduct.length === 0) {
                            return ApiResponse(res, 404, { status: false, msg: 'Product not found', data: null });
                        }
                        db.query("select sum(soldQuantity) as totalSold from batch_sale where productBatchId = ?", [findProductBatch[0].productBatchId], (error, data)=>{
                            if(error){
                                console.log("Error in query")
                                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                            }
                            if(data){
                                const updatedQuantity = (data[0].totalSold - findBatchSales[0].soldQuantity) + parseInt(req.body.soldQuantity)
                                // console.log(updatedQuantity);
                                if(updatedQuantity>findProductBatch[0].quantity)
                                {
                                    return ApiResponse(res, 404, { status: false, msg: 'Sold Quanity Exceeds Remaining Quantity', data: null });
                                }
                                else if(updatedQuantity <= findProductBatch[0].quantity){
                                    const updatedRemainingQuantity = findProductBatch[0].quantity - updatedQuantity
                                    // console.log(updatedRemainingQuantity);
                                    const dateOfSale = new Date(req.body.dateOfSale);
                                    const dateOfProduction = new Date(findProductBatch[0].productionDate);
                                    if (dateOfSale < dateOfProduction) {
                                        return ApiResponse(res, 400, { status: false, msg: 'Date of Sale cannot be earlier than Date of Production', data: null });
                                    }
                                    const updateBatchSaleQuery = `
                            UPDATE batch_sale
                            SET soldQuantity = ?, dateOfSale = ?
                            WHERE batchSaleId = ?
                        `;
                        db.query(updateBatchSaleQuery, [req.body.soldQuantity, req.body.dateOfSale, req.params.id], (err) => {
                            if (err) {
                                console.error('Database query error:', err);
                                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                            }
                            const updateProductBatchQuery = `
                                UPDATE product_batch
                                SET remainingQuantity = ?
                                WHERE productBatchId = ?
                            `;
                            db.query(updateProductBatchQuery, [updatedRemainingQuantity, findProductBatch[0].productBatchId], (err) => {
                                if (err) {
                                    console.error('Database query error:', err);
                                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                                }
                                // Respond with the updated batch sale details
                                return ApiResponse(res, 200, { status: true, msg: 'Updated successfully', data: findBatchSales[0] });
                            });
                        });
                                }

                            }
                        });
                    });
                });
            });
        });
    } catch (err) {
        console.error('Server error:', err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
    }
};
batchSalesController.findByIdandDelete = async (req, res) => {
    try {
        // Check if the user is valid
        if (!req.user) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid user', data: null });
        }
        // Validate the request body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() });
        }
        // Find the user
        const findUserQuery = "SELECT * FROM users WHERE userId = ?";
        db.query(findUserQuery, [req.user.userId], (err, findUser) => {
            if (err) {
                console.error('Database query error:', err);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
            }
            if (findUser.length === 0) {
                return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null });
            }
            // Find the specific batch sale by ID
            const findBatchSalesQuery = "SELECT * FROM batch_sale WHERE batchSaleId = ?";
            db.query(findBatchSalesQuery, [req.params.id], (err, findBatchSales) => {
                if (err) {
                    console.error('Database query error:', err);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                }
                if (findBatchSales.length === 0) {
                    return ApiResponse(res, 404, { status: false, msg: 'Batch Sale not found', data: null });
                }
                // Find the related product batch
                const findProductBatchQuery = "SELECT * FROM product_batch WHERE productBatchId = ?";
                db.query(findProductBatchQuery, [findBatchSales[0].productBatchId], (err, findProductBatch) => {
                    if (err) {
                        console.error('Database query error:', err);
                        return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                    }
                    if (findProductBatch.length === 0) {
                        return ApiResponse(res, 404, { status: false, msg: 'Product Batch not found', data: null });
                    }
                    // Update the remaining quantity in the product batch
                    const updatedRemainingQuantity = findProductBatch[0].remainingQuantity + findBatchSales[0].soldQuantity;
                    const updateProductBatchQuery = `
                        UPDATE product_batch
                        SET remainingQuantity = ?
                        WHERE productBatchId = ?
                    `;
                    db.query(updateProductBatchQuery, [updatedRemainingQuantity, findBatchSales[0].productBatchId], (err) => {
                        if (err) {
                            console.error('Database query error:', err);
                            return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                        }
                        // Delete the batch sale
                        const deleteBatchSalesQuery = "DELETE FROM batch_sale WHERE batchSaleId = ?";
                        db.query(deleteBatchSalesQuery, [req.params.id], (err) => {
                            if (err) {
                                console.error('Database query error:', err);
                                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                            }
                            // Respond with success
                            return ApiResponse(res, 200, { status: true, msg: 'Batch Sales deleted successfully', data: null });
                        });
                    });
                });
            });
        });
    } catch (err) {
        console.error('Server error:', err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
    }
};


module.exports = batchSalesController
