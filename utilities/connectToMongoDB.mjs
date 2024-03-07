import mongoose from "mongoose"
const connectToMongoDB = async () => {
    const connection = await mongoose.connect(process.env.DB)
    console.log(`MongoDB connection successful: ${connection.connection.host}`)
}
export default connectToMongoDB