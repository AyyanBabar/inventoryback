const express = require('express');
const dotenv = require("dotenv").config()
const connectDB = require('./src/Database/database.config')
const cors = require('cors')

const app = express()

const corsOptions = {
    origin: '*'
  };
  
  app.use(cors(corsOptions));

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
  });
  
  

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