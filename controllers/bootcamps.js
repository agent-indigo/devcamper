// imports
const AsyncHandler = require('../middleware/AsyncHandler')
const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utilities/ErrorResponse')
const path = require('path')
// const GeoCoder = require('../utilities/GeoCoder')
// methods
// @name    getBootcamps
// @desc    Display all forthcoming bootcamps
// @route   GET /api/v1/bootcamps
// @access  Public
exports.getBootcamps = AsyncHandler(async(request, response, next) => {
    response.status(200).json(response.AdvancedResults)
})
// @name    getBootcampsWithinRadius
// @desc    Display bootcamps within a radius
// @route   GET /api/v1/bootcamps/:zip/:distance
// @access  Private
// exports.getBootcampsWihinRadius = AsyncHandler(async (request, response, next) => {
//     const { zip, distance } = request.params
//     // get coordinates
//     const location = await GeoCoder.geocode(zip)
//     const latitude = location[0].latitude
//     const longitude = location[0].longitude
//     // calc radius using radians
//     // divide distance of radius of Earth
//     // Earth.radius = 3963mi = 6378.1km
//     const radius = distance / 6378.1
//     const bootcamps = await Bootcamp.find({
//         location: {
//             $geoWithin: {
//                 $centerSphere: [
//                     [
//                         longitude,
//                         latitude
//                     ], radius
//                 ]
//             }
//         }
//     })
//     response.status(200).json({
//         success: true,
//         count: bootcamps.length,
//         data: bootcamps
//     })
// })
// @name    getBootcamp
// @desc    Display a single bootcamp
// @route   GET /api/v1/bootcamps/:id
// access   Public
exports.getBootcamp = AsyncHandler(async(request, response, next) => {
    const bootcamp = await Bootcamp.findById(request.params.id)
    if(!bootcamp) return next(ErrorResponse(`Bootcamp with ID of ${request.params.id} not found.`, 404))
    response.status(200).json({
        success: true,
        data: bootcamp
    })
})
// @name    addBootcamp
// @desc    Add a bootcamp
// @route   POST /api/v1/bootcamps
// access   Private
exports.addBootcamp = AsyncHandler(async(request, response, next) => {
    const bootcamp = await Bootcamp.create(request.body)
    response.status(201).json({
        success: true,
        data: bootcamp
    })
})
// @name    Upload photo for bootcamp
// @route   PUT /api/v1/bootcamps/:id/photo
// @acces   Private
exports.bootcampPhotoUpload = AsyncHandler(async(request, response, next) => {
    const bootcamp = await Bootcamp.findById(request.params.id)
    if(!bootcamp) return next(ErrorResponse(`Bootcamp with ID of ${request.params.id} not found`, 404))
    if(!request.files) return next(ErrorResponse(`Please upload a photo.`, 400))
    const file = request.files.file
    // validate that the uploaded file is a photo
    if(!file.mimetype.startsWith('image')) return next(ErrorResponse('Please upload a photo.', 400))
    // validate file size
    if(file.size > process.env.MAX_FILE_UPLOAD_SIZE) return next(ErrorResponse(`Please upload a photo smaller than ${process.env.MAX_FILE_UPLOAD_SIZE}.`, 400))
    // create custom file name
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async error => {
        if(error) {
            console.error(error)
            return next(ErrorResponse('File upload error.', 500))
        }
        await Bootcamp.findByIdAndUpdate(request.params.id, { photo: file.name })
        response.status(200).json({
            success: true,
            data: file.name
        })
    })
})
// @name    updateBootcamp
// @desc    Update a bootcamp
// @route   PATCH /api/v1/bootcamps/:id
// access   Private
exports.updateBootcamp = AsyncHandler(async(request, response, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(request.params.id, request.body, {
        new: true,
        runValidators: true
    })
    if(!bootcamp) return next(ErrorResponse(`Bootcamp with ID of ${request.params.id} not found.`, 404))
    response.status(200).json({
        success: true,
        data: bootcamp
    })
})
// @name    deleteBootcamp
// @desc    Delete a bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  Private
exports.deleteBootcamp = AsyncHandler(async(request, response, next) => {
    const bootcamp = await Bootcamp.findById(request.params.id)
    if(!bootcamp) return next(ErrorResponse(`Bootcamp with ID of ${request.params.id} not found.`, 404))
    await bootcamp.remove()
    response.status(200).json({ success: true })
})