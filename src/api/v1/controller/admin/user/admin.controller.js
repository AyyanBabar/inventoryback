const ApiResponse = require('../../../../../Response/api.resposne')
const { validationResult } = require("express-validator");
const db = require('../../../../../Database/database.config')

const adminController = {}

adminController.create = async (req, res) => {
    try {
        // Find user by ID
        db.query("SELECT * FROM users WHERE email = ?", [req.user.email], (error, findUserResult) => {
            if (error) {
                console.error('Database query error:', error);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
            }

            if (findUserResult.length === 0) {
                return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null });
            }

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() });
            }

            // Check if the email already exists
            db.query("SELECT * FROM users WHERE email = ?", [req.body.email], (error, existingUserResult) => {
                if (error) {
                    console.error('Database query error:', error);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
                }

                if (existingUserResult.length > 0) {
                    return ApiResponse(res, 400, { status: false, msg: 'Email already exists', data: null });
                }

                // Insert new user
                db.query("INSERT INTO users (name, email, password, role, verified) VALUES (?, ?, ?, ?, ?)", 
                [req.body.name, req.body.email, req.body.password, req.body.role, [req.body.isVerified? 1 : 0]], 
                (error, newUserResult) => {
                    if (error) {
                        console.error('Database query error:', error);
                        return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
                    }

                    return ApiResponse(res, 200, { status: true, msg: 'User created successfully', data: { id: newUserResult.insertId, ...req.body } });
                });
            });
        });
    } catch (err) {
        console.error('Internal Server Error:', err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
    }
};
adminController.find = async (req, res) => {
    console.log(req.user)
    try {
        db.query("SELECT * FROM users WHERE email = ?", [req.user.email], (error, findUserResult) => {
            if (error) {
                console.error('Database query error:', error);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
            }

            if (findUserResult.length === 0) {
                return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null });
            }

            db.query("SELECT userId, name, email, role FROM users", [], (error, usersResult) => {
                if (error) {
                    console.error('Database query error:', error);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
                }

                return ApiResponse(res, 200, { status: true, msg: 'Users retrieved successfully', data: usersResult });
            });
        });
    } catch (err) {
        console.error('Internal Server Error:', err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
    }
};
adminController.delete = async (req, res) => {
    try {
        db.query("SELECT * FROM users WHERE email = ?", [req.user.email], (error, findUserResult) => {
            if (error) {
                console.error('Database query error:', error);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
            }

            if (findUserResult.length === 0) {
                return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null });
            }

            const userId = req.params.id;
            console.log(userId)
            db.query("SELECT * FROM users WHERE userId = ?", [userId], (error, userToDeleteResult) => {
                if (error) {
                    console.error('Database query error:', error);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
                }

                if (userToDeleteResult.length === 0) {
                    return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null });
                }

                db.query("DELETE FROM users WHERE userId = ?", [userId], (error, deleteResult) => {
                    if (error) {
                        console.error('Database query error:', error);
                        return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
                    }

                    return ApiResponse(res, 200, { status: true, msg: 'User deleted successfully', data: null });
                });
            });
        });
    } catch (err) {
        console.error('Internal Server Error:', err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
    }
};
adminController.getallusers = async (req, res) => {
    try {
        db.query("SELECT userId, name FROM users WHERE role = 'user'", [], (error, usersResult) => {
                if (error) {
                    console.error('Database query error:', error);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
                }
                return ApiResponse(res, 200, { status: true, msg: 'Users retrieved successfully', data: usersResult });
            });
    } catch (err) {
        console.error('Internal Server Error:', err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
    }
};
adminController.getallcompanies = async (req, res) => {
    try {
            db.query("SELECT companyId, companyName FROM company", [], (error, companiesResult) => {
                if (error) {
                    console.error('Database query error:', error);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
                }
                return ApiResponse(res, 200, { status: true, msg: 'Companies retrieved successfully', data: companiesResult });
            });
    } catch (err) {
        console.error('Internal Server Error:', err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
    }
};


// adminController.create = async (req, res) => {
//     try {
//         const findUser = await User.findById(req.user._id)
//         if (!findUser) {
//             return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
//         }
//         const errors = validationResult(req)
//         if (!errors.isEmpty()) {
//             return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() })
//         }
//         const existingUser = await User.findOne({ email: req.body.email })

//         if (existingUser) {
//             return ApiResponse(res, 400, { status: false, msg: 'Email already exist', data: null })
//         }
//         const newUser = await User.create(req.body);
//         const { password, ...rest } = newUser._doc
//         return ApiResponse(res, 200, { status: true, msg: 'User created Succesfully', data: rest })

//     } catch (err) {
//         console.log(err)
//         return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })

//     }
// }
// adminController.find = async (req, res) => {
//     try {
//         // console.log(req)
//         // console.log(req.body)
//         const findUser = await User.findById(req.user._id)
//         if (!findUser) {
//             return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
//         }
//         const users = await User.find({}, '-password');

//         return ApiResponse(res, 200, { status: true, msg: 'Users retrieved successfully', data: users });
//     } catch (err) {
//         console.log(err)
//         return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })

//     }

// }
// adminController.delete = async (req, res) => {
//     try {
//         const findUser = await User.findById(req.user._id)
//         if (!findUser) {
//             return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
//         }

//         const userId = req.params.id;

//         const userToDelete = await User.findById(userId);
//         console.log(userId)
//         if (!userToDelete) {
//             return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
//         }

//         await User.findByIdAndDelete(userId);

//         return ApiResponse(res, 200, { status: true, msg: 'User deleted successfully', data: null });
//     } catch (err) {
//         console.log(err)
//         return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
//     }
// }
// adminController.getallusers = async (req, res) => {
//     try {
//         const findUser = await User.findById(req.user._id)
//         if (!findUser) {
//             return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
//         }
//         const users = await User.find({role: 'user'}, '_id name');

//         return ApiResponse(res, 200, { status: true, msg: 'Users retrieved successfully', data: users });
//     } catch (err) {
//         console.log(err)
//         return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })

//     }

// }
// adminController.getallcompanies = async (req, res) => {
//     try {
//         const findUser = await User.findById(req.user._id)
//         if (!findUser) {
//             return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
//         }
//         const companies = await Company.find({}, '_id companyName');

//         return ApiResponse(res, 200, { status: true, msg: 'Companies retrieved successfully', data: companies });
//     } catch (err) {
//         console.log(err)
//         return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })

//     }

// }



module.exports = adminController