// imports
const AsyncHandler = require('../middleware/AsyncHandler')
const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utilities/ErrorResponse')
const path = require('path')
// const GeoCoder = require('../utilities/GeoCoder')
// methods
/**
 * @name    showBootcamps
 * @desc    Show all forthcoming bootcamps
 * @route   GET /api/v1/bootcamps
 * @access  public
 */
exports.showBootcamps = AsyncHandler(async(request, response, next) => {
    response.status(200).json(response.AdvancedResults)
})
/**
 * @name    showBootcampsWithinRadius
 * @desc    Show bootcamps within a radius
 * @route   GET /api/v1/bootcamps/:zip/:distance
 * @access  private
 */
// exports.showBootcampsWihinRadius = AsyncHandler(async (request, response, next) => {
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
// }
/**
 * @name    showBootcamp
 * @desc    Show a single bootcamp
 * @route   GET /api/v1/bootcamps/:id
 * @access  public
 */
exports.showBootcamp = AsyncHandler(async(request, response, next) => {
    const bootcamp = await Bootcamp.findById(request.params.id)
    if(!bootcamp) return next(ErrorResponse(`Bootcamp with ID of ${request.params.id} not found.`, 404))
    response.status(200).json({
        success: true,
        data: bootcamp
    })
})
/**
 * @name    addBootcamp
 * @desc    Add a bootcamp
 * @route   POST /api/v1/bootcamps
 * @access  private
 */
exports.addBootcamp = AsyncHandler(async(request, response, next) => {
    // add user to body
    request.body.user = request.user.id
    // check for published bootcamp
    const publishedBootcamp = await Bootcamp.findOne({ user: request.user.id })
    // non-admin users can only add one bootcamp
    if(publishedBootcamp && request.user.role !== 'admin') return next(ErrorResponse('You have already published a bootcamp.', 400))
    const bootcamp = await Bootcamp.create(request.body)
    response.status(201).json({
        success: true,
        data: bootcamp
    })
})
/**
 * @name    bootcampPhotoUpload
 * @desc    Upload photo for bootcamp
 * @route   PUT /api/v1/bootcamps/:id/photo
 * @access  private
 */
exports.bootcampPhotoUpload = AsyncHandler(async(request, response, next) => {
    const bootcamp = await Bootcamp.findById(request.params.id)
    if(!bootcamp) return next(ErrorResponse(`Bootcamp with ID of ${request.params.id} not found`, 404))
    // verify that user is bootcamp owner
    if(bootcamp.user.toString() !== request.user.id && request.user.role !== 'admin') return next(ErrorResponse('Not authorized.', 401))
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
/**
 * @name    editBootcamp
 * @desc    Edit a bootcamp
 * @route   PUT /api/v1/bootcamps/:id
 * @access  private
 */
exports.editBootcamp = AsyncHandler(async(request, response, next) => {
    let bootcamp = await Bootcamp.findById(request.params.id)
    if(!bootcamp) return next(ErrorResponse(`Bootcamp with ID of ${request.params.id} not found.`, 404))
    // verify that user is bootcamp owner
    if(bootcamp.user.toString() !== request.user.id && request.user.role !== 'admin') return next(ErrorResponse('Not authorized.', 401))
    bootcamp = await Bootcamp.findByIdAndUpdate(request.params.id, request.body, {
        new: true,
        runValidators: true
    })
    response.status(200).json({
        success: true,
        data: bootcamp
    })
})
/**
 * @name    deleteBootcamp
 * @desc    Delete a bootcamp
 * @route   DELETE /api/v1/bootcamps/:id
 * @access  private
 */
exports.deleteBootcamp = AsyncHandler(async(request, response, next) => {
    const bootcamp = await Bootcamp.findById(request.params.id)
    if(!bootcamp) return next(ErrorResponse(`Bootcamp with ID of ${request.params.id} not found.`, 404))
    // verify that user is bootcamp owner
    if(bootcamp.user.toString() !== request.user.id && request.user.role !== 'admin') return next(ErrorResponse('Not authorized.', 401))
    await bootcamp.remove()
    response.status(200).json({ success: true })
})