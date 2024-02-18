const mongoose = require('mongoose')
const ConnectToMongoDB = async () => {
    const connection = await mongoose.connect(process.env.DB)
    console.log(`MongoDB successfully connected: ${connection.connection.host}`)
}
module.exports = ConnectToMongoDB