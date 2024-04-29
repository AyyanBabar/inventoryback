const express = require('express');
const dotenv = require("dotenv").config()
const connectDB = require('./src/Database/database.config')


const app = express()

const PORT = process.env.PORT || 8080

const mainRouter = require('./src/api/v1/routes/index')

app.use(express.json())

app.use('/api/vi', mainRouter)

//Database Connection
connectDB()



app.listen(PORT, ()=>{console.log('port is listening on port', PORT)})