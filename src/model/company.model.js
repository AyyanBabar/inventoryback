const mongoose = require('mongoose');
const Schema = mongoose.Schema


const CompanySchema = mongoose.Schema({
    userId : {
        type: Schema.Types.ObjectId,
        ref: 'user'
    },
    companyName: {
        required: true,
        type: String
    },
    companyAddress: {
        required: true,
        type: String
    },
    contact: {
        required: true,
        type: String
    }

})

const Company = mongoose.model('Company', CompanySchema)
module.exports = Company