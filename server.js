// imports
const express = require('express')
const dotenv = require('dotenv')
const morgan = require('morgan')
// route files
const bootcamps = require('./routes/bootcamps')
// load environment variables
dotenv.config({ path: './config/config.env' })
// create server
const app = express()
// development logger: "Morgan"
if(process.env.MODE === 'development') app.use(morgan('dev'))
// mount routers
app.use('/api/v1/bootcamps', bootcamps)
// specify port
const PORT = process.env.PORT || 5000
// start server
app.listen(PORT, console.log(`Server running in ${process.env.MODE} mode on localhost:${PORT}.`))