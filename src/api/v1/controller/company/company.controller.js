const ApiResponse = require('../../../../Response/api.resposne')
const { validationResult } = require("express-validator");
const Company = require('../../../../model/index').company
const User = require('../../../../model/index').user
const db = require('../../../../Database/database.config')

const companyController = {}


// companyController.create = async (req, res) => {
//     try {
//         const errors = validationResult(req)
//         if (!errors.isEmpty()) {
//             return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() })
//         }
//         const findUser = await User.findById(req.user._id)
//         if (!findUser) {
//             return ApiResponse(res, 404, { status: false, msg: 'User not found',  data: null })
//         }
//         const existingCompany = await Company?.findOne({ companyName: req.body.companyName })

//         if (existingCompany) {
//             return ApiResponse(res, 400, { status: false, msg: 'company  already exist', data: null })
//         }
//         const newCompanyData = {
//             userId: req.user._id,
//             companyName: req.body.companyName,
//             companyAddress: req.body.companyAddress,
//             contact: req.body.contact
//         };

//         const newCompany = await Company.create(newCompanyData)
//         return ApiResponse(res, 200, { status: true, msg: 'Company created Succesfully', data: newCompany })
//     } catch (err) {
//         return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
//     }
// }
companyController.create = async (req, res) => {
    try {
        // Validate the request body
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
            // Check if the company already exists
            const existingCompanyQuery = "SELECT * FROM company WHERE companyName = ? and userId = ?";
            db.query(existingCompanyQuery, [req.body.companyName, req.user.userId], (err, existingCompany) => {
                if (err) {
                    console.error('Database query error:', err);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                }
                if (existingCompany.length > 0) {
                    return ApiResponse(res, 400, { status: false, msg: 'Company already exists', data: null });
                }
                // Insert new company data
                const newCompanyData = {
                    companyName: req.body.companyName,
                    companyAddress: req.body.companyAddress,
                    contact: req.body.contact,
                    userId: req.user.userId,
                };
                const createCompanyQuery = `
                    INSERT INTO company (companyName, companyAddress, contact, userId)
                    VALUES (?, ?, ?, ?)
                `;
                db.query(createCompanyQuery, [newCompanyData.companyName, newCompanyData.companyAddress, newCompanyData.contact, newCompanyData.userId], (err, newCompany) => {
                    if (err) {
                        console.error('Database query error:', err);
                        return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                    }
                    return ApiResponse(res, 200, { status: true, msg: 'Company Created Successfully', data: newCompany });
                });
            });
        });
    } catch (err) {
        console.error('Server error:', err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
    }
};
companyController.get = async (req, res) => {
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
            // Find companies associated with the user
            const findCompaniesQuery = "SELECT * FROM company WHERE userId = ?";
            db.query(findCompaniesQuery, [req.user.userId], (err, findCompanies) => {
                if (err) {
                    console.error('Database query error:', err);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                }
                if (findCompanies.length === 0) {
                    return ApiResponse(res, 404, { status: false, msg: 'No company is associated with this user', data: null });
                }
                // Return the found companies
                return ApiResponse(res, 200, { status: true, msg: 'Companies Retrived Successfully', data: findCompanies });
            });
        });
    } catch (err) {
        console.error('Server error:', err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
    }
};
// companyController.get = async (req, res) => {
//     try {
//         const findUser = await User.findById(req.user._id)
//         if (!findUser) {
//             return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
//         }
//         const findCompanies = await Company.find({ userId: req.user._id})
//         if (findCompanies.length<=0) {
//             return ApiResponse(res, 404, { status: false, msg: 'No company is associated with this user', data: null })
//         }
//         return ApiResponse(res, 200, { status: true, msg: 'Companies', data: findCompanies })

//     } catch (err) {
//         console.log(err)
//         return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
//     }
// }
// companyController.findById = async (req, res) => {
//     try {
//         const findUser = await User.findById(req.user._id)
//         if (!findUser) {
//             return ApiResponse(res, 404, { status: false, msg: 'User not found', data: null })
//         }
//         const company = await Company.findOne({ _id: req.params.id, userId: req.user._id }) 
//         if (!company) {
//             return ApiResponse(res, 404, { status: false, msg: 'Company not found', data: null });
//         } 
//         return ApiResponse(res, 200, { status: true, msg: 'Company found', data: company });
//     } catch (err) {
//         return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message })
//     }
// }
companyController.findByIdandUpdate = async (req, res) => {
    try {
        const errors = validationResult(req)
        console.log(errors)
        if (!errors.isEmpty()) {
            return ApiResponse(res, 400, { status: false, msg: 'Invalid input', data: errors.array() })
        }
        db.query("select * from company where userId = ? and companyId = ?",[req.user.userId, req.params.id], (error, result)=>{
            if(error){
                console.error('Database query error:', err);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
            }
            if(result.length === 0){
                return ApiResponse(res, 404, { status: false, msg: 'Company not found', data: null });
            }
            if(result[0].companyName == req.body.companyName && result[0].companyAddress == req.body.companyAddress && result[0].contact == req.body.contact)
            {
                return ApiResponse(res, 404, { status: false, msg: 'No Data to Update', data: null });
            }
            db.query("update company set companyName = ?, companyAddress = ?, contact = ? where companyId = ? and userId = ?", [req.body.companyName, req.body.companyAddress, req.body.contact, req.params.id, req.user.userId], (error)=>{
                if (error) {
                    console.error('Database query error:', err);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: err });
                }
                return ApiResponse(res, 200, { status: true, msg: 'Company updated successfully', data: result});
            })
        });
    }
    catch (err) {
        console.error('Server error:', err);
        return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
        }
}
companyController.findByIdandDelete = async (req, res) => {
    try {
        db.query("select * from company where userId = ? and companyId = ?", [req.user.userId, req.params.id], (error, findCompany)=>{
            if(error){
                console.error('Database query error:', err);
                return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
            }
            if(findCompany.lenght === 0){
                return ApiResponse(res, 404, { status: false, msg: 'Company not found', data: null });
            }
            db.query("delete from company where companyId = ? and userId = ?", [req.params.id, req.user.userId], (error)=>{
                if(error){
                    console.error('Database query error:', err);
                    return ApiResponse(res, 500, { status: false, msg: 'Database query error', data: error });
                }
                return ApiResponse(res, 200, { status: true, msg: 'Company Deleted Successfully', data: null });
            });
        });
        }catch (err) {
            console.error('Server error:', err);
            return ApiResponse(res, 500, { status: false, msg: 'Internal Server error', data: err.message });
        }
}
module.exports = companyController;