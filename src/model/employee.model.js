const mongoose = require('mongoose')

const employeeSchema = new mongoose.Schema({
    userId : {
        type: String,
        required: true
    },
    companyId : {
        type: String,
        required: true
    }

});

employeeSchema.index({userId : 1, companyId: 1}, {unique: true});

const Employee = mongoose.model('Employee', employeeSchema)
module.exports = Employee