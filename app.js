const express = require('express');
const dotenv = require("dotenv").config()
const connectDB = require('./src/Database/database.config')
const cors = require('cors')

const app = express()

const corsOptions = {
    origin: 'https://inventory-mangment.vercel.app/'
  };
  
  app.use(cors(corsOptions));



const PORT = process.env.PORT || 8080

const mainRouter = require('./src/api/v1/routes/index')
const adminRoutes = require('./src/api/v1/routes/admin/index')

app.use(express.json())

app.use('/api/vi', mainRouter)
app.use('/api/vi/admin', adminRoutes )

//Database Connection
connectDB()

//commitda
app.get('/', (req,res)=>{res.send('succesful git')})
app.listen(PORT, ()=>{console.log('port is listening on port', PORT)})