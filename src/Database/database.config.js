const mysql = require('mysql2')
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

connection.connect((err)=>{
    if(err){
        console.error("Error connecting to Database", err);
    }
    if(!err){
        console.log("Mysql Database Connected");
    }
})

module.exports = connection















// const mongoose = require('mongoose');

// const connectDB = async () => {
//     try {
//         const connect = await mongoose.connect(process.env.MONGODB_URL)
//         console.log('databse connected')
//     } catch (Err) {
//         console.error(Err);
//     }

// }

// module.exports = connectDB;
