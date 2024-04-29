const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URL)
        console.log('databse connected')
    } catch (Err) {
        console.error(Err);
    }

}

module.exports = connectDB;
