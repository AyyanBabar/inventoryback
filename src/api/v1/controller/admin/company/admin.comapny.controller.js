const ApiResponse = require('../../../../../Response/api.resposne')
const { validationResult } = require("express-validator");
const db = require('../../../../../Database/database.config')
const adminComapnyController = {}

adminComapnyController.create = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() });
        }

        db.query("SELECT * FROM users WHERE email = ?", [req.user.email], (error, findUserResult) => {
            if (error) {
                console.error('Database query error:', error);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
            }

            if (findUserResult.length === 0) {
                return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null });
            }

            db.query("SELECT * FROM company WHERE companyName = ?", [req.body.companyName], (error, existingCompanyResult) => {
                if (error) {
                    console.error('Database query error:', error);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
                }

                if (existingCompanyResult.length > 0) {
                    return ApiResponse(res, 400, { status: false, msg: 'Company already exists', data: null });
                }

                db.query("INSERT INTO company (companyName, companyAddress, contact, userId) VALUES (?, ?, ?, ?)", 
                [req.body.companyName, req.body.companyAddress, req.body.contact, req.body.userId], 
                (error, newCompanyResult) => {
                    if (error) {
                        console.error('Database query error:', error);
                        return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
                    }

                    return ApiResponse(res, 200, { status: true, msg: 'Company created successfully', data: null });
                });
            });
        });
    } catch (err) {
        console.error('Internal Server Error:', err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
    }
};
adminComapnyController.get = async (req, res) => {
    try {
        db.query("SELECT * FROM users WHERE email = ?", [req.user.email], (error, findUserResult) => {
            if (error) {
                console.error('Database query error:', error);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
            }

            if (findUserResult.length === 0) {
                return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null });
            }

            db.query("SELECT * FROM company", [], (error, companiesResult) => {
                if (error) {
                    console.error('Database query error:', error);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
                }

                return ApiResponse(res, 200, { status: true, msg: 'Companies retrieved successfully', data: companiesResult });
            });
        });
    } catch (err) {
        console.error('Internal Server Error:', err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
    }
};
adminComapnyController.findById = async (req, res) => {
    try {
        db.query("SELECT * FROM users WHERE userId = ?", [req.user.userId], (error, findUserResult) => {
            if (error) {
                console.error('Database query error:', error);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
            }

            if (findUserResult.length === 0) {
                return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null });
            }

            db.query("SELECT * FROM company WHERE companyId = ?", [req.params.id], (error, companyResult) => {
                if (error) {
                    console.error('Database query error:', error);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
                }

                if (companyResult.length === 0) {
                    return ApiResponse(res, 404, { status: false, msg: 'Company not found', data: null });
                }

                return ApiResponse(res, 200, { status: true, msg: 'Company found', data: companyResult[0] });
            });
        });
    } catch (err) {
        console.error('Internal Server Error:', err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
    }
};
adminComapnyController.findByIdandUpdate = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() });
        }

        db.query("SELECT * FROM users WHERE userId = ?", [req.user.userId], (error, findUserResult) => {
            if (error) {
                console.error('Database query error:', error);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
            }

            if (findUserResult.length === 0) {
                return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null });
            }

            db.query("SELECT * FROM company WHERE companyId = ?", [req.params.id], (error, companyResult) => {
                if (error) {
                    console.error('Database query error:', error);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
                }

                if (companyResult.length === 0) {
                    return ApiResponse(res, 404, { status: false, msg: 'Company not found', data: null });
                }

                db.query(`UPDATE company SET companyName = ?, companyAddress = ?, contact = ? WHERE companyId = ?`, [req.body.companyName, req.body.companyAddress, req.body.contact, req.params.id], (error, updateResult) => {
                    if (error) {
                        console.error('Database query error:', error);
                        return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
                    }

                    return ApiResponse(res, 200, { status: true, msg: 'Company updated successfully', data: updateResult });
                });
            });
        });
    } catch (err) {
        console.error('Internal Server Error:', err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
    }
};
adminComapnyController.findByIdandDelete = async (req, res) => {
    try {
        db.query("SELECT * FROM users WHERE userId = ?", [req.user.userId], (error, findUserResult) => {
            if (error) {
                console.error('Database query error:', error);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
            }

            if (findUserResult.length === 0) {
                return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null });
            }

            db.query("SELECT * FROM company WHERE companyId = ?", [req.params.id], (error, companyResult) => {
                if (error) {
                    console.error('Database query error:', error);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
                }

                if (companyResult.length === 0) {
                    return ApiResponse(res, 404, { status: false, msg: 'Company not found', data: null });
                }
                db.query("DELETE FROM company WHERE companyId = ?", [req.params.id], (error, deleteResult) => {
                    if (error) {
                        console.error('Database query error:', error);
                        return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
                    }

                    return ApiResponse(res, 200, { status: true, msg: 'Company deleted successfully', data: null });
                });
            });
        });
    } catch (err) {
        console.error('Internal Server Error:', err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
    }
};


// adminComapnyController.create = async (req, res) => {
//     try {
//         const errors = validationResult(req)
//         if (!errors.isEmpty()) {
//             return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() })
//         }
//         const findUser = await User.findById(req.user._id)
//         if (!findUser) {
//             return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
//         }
//         const existingCompany = await Company?.findOne({ companyName: req.body.companyName })

//         if (existingCompany) {
//             return ApiResponse(res, 400, { status: false, msg: 'company  already exist', data: null })
//         }
//         const newCompanyData = {
//             userId: req.body.userId,
//             companyName: req.body.companyName,
//             companyAddress: req.body.companyAddress,
//             contact: req.body.contact
//         };
        
//         const newCompany = await Company.create(newCompanyData)
//         return ApiResponse(res, 200, { status: true, msg: 'Company created Succesfully', data: newCompany, })
//     } catch (err) {
//         return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
//     }
// }

// adminComapnyController.get = async (req, res) => {
//     try {
        
//         const findUser = await User.findById(req.user._id)
//         if (!findUser) {
//             return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
//         }
//         const findCompanies = await Company.find()

//         return ApiResponse(res, 200, { status: true, msg: 'Companies', data: findCompanies })

//     } catch (err) {
//         return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
//     }
// }

// adminComapnyController.findById = async (req, res) => {
//     try {
//         const findUser = await User.findById(req.user._id)
//         if (!findUser) {
//             return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
//         }
//         const company = await Company.findOne({ _id: req.params.id }) 
//         if (!company) {
//             return ApiResponse(res, 404, { status: false, msg: 'Company not found', data: null });
//         } 
//         return ApiResponse(res, 200, { status: true, msg: 'Company found', data: company });
//     } catch (err) {
//         return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
//     }
// }


// adminComapnyController.findByIdandUpdate = async (req, res) => {
//     try {
//         const errors = validationResult(req)
//         console.log(errors)
//         if (!errors.isEmpty()) {
//             return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() })
//         }
//         const findUser = await User.findById(req.user._id)
//         if (!findUser) {
//             return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
//         }
//         const findcompany = await Company.findOne({ _id: req.params.id})
//         if (!findcompany) {
//             return ApiResponse(res, 404, { status: false, msg: 'Company not found', data: null });
//         } 
//         if (req.body.companyName) findcompany.companyName = req.body.companyName;
//         if (req.body.companyAddress) findcompany.companyAddress = req.body.companyAddress;
//         if (req.body.companyContact) findcompany.companyContact = req.body.companyContact;

//         await findcompany.save()

//         return ApiResponse(res, 200, { status: true, msg: 'Company found', data: findcompany});
//     } catch (err) {
//         return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
//     }
// }


// adminComapnyController.findByIdandDelete = async (req, res) => {
//     try {
//         const findUser = await User.findById(req.user._id)
//         if (!findUser) {
//             return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
//         }
//         const findcompany = await Company.findOne({ _id: req.params.id })
//         if (!findcompany) {
//             return ApiResponse(res, 404, { status: false, msg: 'Company not found', data: null });
//         } 
        
//         console.log(findcompany)
//         await Company.deleteOne({_id: req.params.id})
//         return ApiResponse(res, 200, { status: true, msg: 'Company deleted succesfully', data: findcompany});
//     } catch (err) {
//         return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
//     }
// }

module.exports = adminComapnyController
