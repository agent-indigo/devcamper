// imports
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
const ConnectToMongoDB = require('./config/ConnectToMongoDB')
const ErrorHandler = require('./middleware/ErrorHandler')
// route files
const bootcamps = require('./routes/bootcamps')
// load environment variables
dotenv.config({ path: './config/config.env' })
// connect to MongoDB
ConnectToMongoDB()
// create server
const app = express()
// body parser
app.use(express.json())
// development logger: "Morgan"
if(process.env.MODE === 'development') app.use(morgan('dev'))
// mount routers
app.use('/api/v1/bootcamps', bootcamps)
// error handler
app.use(ErrorHandler)
// specify port
const PORT = process.env.PORT || 5000
// start server
const server = app.listen(PORT, console.log(`Server running in ${process.env.MODE} mode on localhost:${PORT}.`))
// handle promise rejections
process.on('unhandledRejection', (error, promise) => {
    console.error(`Error: ${error.message}`)
    // close server & exit process
    server.close(() => process.exit(1))
})