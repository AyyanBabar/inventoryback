const express = require('express');
const dotenv = require("dotenv").config()
const connectDB = require('./src/Database/database.config')
const cors = require('cors')

const app = express()

const corsOptions = {
    origin: '*'
  };
  
  app.use(cors(corsOptions));



const PORT = process.env.PORT || 8080

const mainRouter = require('./src/api/v1/routes/user/index')
const adminRoutes = require('./src/api/v1/routes/admin/index')
const publicRoute = require("./src/api/v1/routes/public/index")
const vendorRoute = require("./src/api/v1/routes/vendor/index")
const employee = require('./src/api/v1/routes/employee/index')

app.use(express.json())

app.use('/api/', publicRoute)
app.use('/api/vi', mainRouter)
app.use('/api/vi/admin', adminRoutes )
app.use('/api/vi/vendor', vendorRoute )
app.use('/api/vi', employee)


//Database Connection
connectDB()

//commitda
app.get('/', (req,res)=>{res.send('succesful git')})
app.listen(PORT, ()=>{console.log('port is listening on port', PORT)})
