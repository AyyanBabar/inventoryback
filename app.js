// const express = require('express');
// const dotenv = require("dotenv").config()
// const connectDB = require('./src/Database/database.config')
// const cors = require('cors')

// const app = express()

// const corsOptions = {
//     origin: 'https://inventory-mangment.vercel.app/'
//   };
  
//   app.use(cors(corsOptions));
  

// const PORT = process.env.PORT || 8080

// const mainRouter = require('./src/api/v1/routes/index')
// const adminRoutes = require('./src/api/v1/routes/admin/index')

// app.use(express.json())

// app.use('/api/vi', mainRouter)
// app.use('/api/vi/admin', adminRoutes )

// //Database Connection
// connectDB()

// //commitda
// app.get('/', (req,res)=>{res.send('succesful git')})
// app.listen(PORT, ()=>{console.log('port is listening on port', PORT)})
const express = require('express');
const dotenv = require("dotenv").config();
const connectDB = require('./src/Database/database.config');
const cors = require('cors');
const https = require('https');
const fs = require('fs');

const app = express();

// Enable CORS with specific options
const corsOptions = {
    origin: 'https://inventory-mangment.vercel.app/'
};
app.use(cors(corsOptions));

const PORT = process.env.PORT || 8080;

const mainRouter = require('./src/api/v1/routes/index');
const adminRoutes = require('./src/api/v1/routes/admin/index');

app.use(express.json());

app.use('/api/v1', mainRouter);
app.use('/api/v1/admin', adminRoutes);

// Database Connection
connectDB();

// SSL Configuration
const options = {
    key: fs.readFileSync('key.pem'),
    cert: fs.readFileSync('cert.pem')
};

// Define HTTP server
const server = https.createServer(options, app);

// Start the server
server.listen(PORT, () => {
    console.log('Server is listening on port', PORT);
});
