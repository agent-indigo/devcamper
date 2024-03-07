import {readFileSync} from 'fs'
import {dirname} from 'path'
import {fileURLToPath} from 'url'
import bootcampModel from './models/bootcampModel.mjs'
import courseModel from './models/courseModel.mjs'
import reviewModel from './models/reviewModel.mjs'
import userModel from './models/userModel.mjs'
import connectToMongoDB from './utilities/connectToMongoDB.mjs'
const seeder = (() => {
    connectToMongoDB()
    const deleteData = async () => {
        try {
            await bootcampModel.deleteMany()
            await courseModel.deleteMany()
            await reviewModel.deleteMany()
            await userModel.deleteMany()
            console.log('Data successfully deleted.')
            process.exit()
        } catch (error) {
            console.error(`Error encountered while deleting data:\n${error}`)
            process.exit(1)
        }
    }
    const importData = async () => {
        try {
            await bootcampModel.insertMany(JSON.parse(readFileSync(`${dirname(fileURLToPath(import.meta.url))}/data/bootcamps.json`, 'utf-8')))
            await courseModel.insertMany(JSON.parse(readFileSync(`${dirname(fileURLToPath(import.meta.url))}/data/courses.json`, 'utf-8')))
            await reviewModel.insertMany(JSON.parse(readFileSync(`${dirname(fileURLToPath(import.meta.url))}/data/reviews.json`, 'utf-8')))
            await userModel.insertMany(JSON.parse(readFileSync(`${dirname(fileURLToPath(import.meta.url))}/data/users.json`, 'utf-8')))
            console.log('Data successfully imported.')
            process.exit()
        } catch (error) {
            console.error(`Error encountered while importing data:\n${error}`)
            process.exit(1)
        }
    }
    if (process.argv[2] === '-i') {
        importData()
    } else if (process.argv[2] === '-d') {
        deleteData()
    }
})()
export default seeder