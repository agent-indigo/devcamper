// imports
const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
// load models
const Bootcamp = require('./models/Bootcamp')
const Course = require('./models/Course')
const User = require('./models/User')
// load environment variables
dotenv.config({ path: './config/config.env' })
// connect to MongoDB
mongoose.connect(process.env.DB)
// read JSON files
const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'))
const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'))
const users = JSON.parse(fs.readFileSync(`${__dirname}/_data/users.json`, 'utf-8'))
// import into db
const importData = async () => {
    try {
        await Bootcamp.create(bootcamps)
        await Course.create(courses)
        await User.create(users)
        console.log('Data successfully imported.')
        process.exit()
    } catch(error) {
        console.error(error)
    }
}
// delete data
const deleteData = async () => {
    try {
        await Bootcamp.deleteMany()
        await Course.deleteMany()
        await User.deleteMany()
        console.log('Data successfully deleted.')
        process.exit()
    } catch(error) {
        console.error(error)
    }
}
if(process.argv[2] === '-i') {
    importData()
} else if(process.argv[2] === '-d') {
    deleteData()
}