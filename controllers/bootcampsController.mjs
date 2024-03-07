import asyncHandler from '../middleware/asyncHandler.mjs'
import bootcampModel from '../models/bootcampModel.mjs'
import geoCoder from '../utilities/geoCoder.mjs'
import {parse} from 'path'
/**
 * @name    showBootcamps
 * @desc    Show all forthcoming bootcamps
 * @route   GET /api/v1/bootcamps
 * @access  public
 */
export const showBootcamps = asyncHandler(async(request, response, next) => {
    response.status(200).json(response.AdvancedResults)
})
/**
 * @name    showBootcampsWithinRadius
 * @desc    Show bootcamps within a radius
 * @route   GET /api/v1/bootcamps/:zip/:distance
 * @access  private
 */
export const showBootcampsWihinRadius = asyncHandler(async (request, response, next) => {
    const {zip, distance} = request.params
    const location = await geoCoder.geocode(zip)
    const latitude = location[0].latitude
    const longitude = location[0].longitude
    const radius = distance / 6378.1
    const bootcamps = await bootcampModel.find({
        location: {
            $geoWithin: {
                $centerSphere: [
                    [
                        longitude,
                        latitude
                    ], radius
                ]
            }
        }
    })
    response.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    })
})
/**
 * @name    showBootcamp
 * @desc    Show a single bootcamp
 * @route   GET /api/v1/bootcamps/:id
 * @access  public
 */
export const showBootcamp = asyncHandler(async(request, response, next) => {
    const bootcamp = await bootcampModel.findById(request.params.id)
    if(!bootcamp) throw new Error(`Bootcamp with ID of ${request.params.id} not found.`)
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
export const addBootcamp = asyncHandler(async(request, response, next) => {
    request.body.user = request.user.id
    const publishedBootcamp = await bootcampModel.findOne({user: request.user.id})
    if(publishedBootcamp && request.user.role !== 'admin') throw new Error('You have already published a bootcamp.')
    const bootcamp = await bootcampModel.create(request.body)
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
export const bootcampPhotoUpload = asyncHandler(async(request, response, next) => {
    const bootcamp = await bootcampModel.findById(request.params.id)
    if(!bootcamp) throw new Error(`Bootcamp with ID of ${request.params.id} not found`)
    if(bootcamp.user.toString() !== request.user.id && request.user.role !== 'admin') throw new Error('Not authorized.')
    if(!request.files) throw new Error(`Please upload a photo.`)
    const file = request.files.file
    if(!file.mimetype.startsWith('image')) throw new Error('Please upload a photo.')
    if(file.size > process.env.MAX_FILE_UPLOAD_SIZE) throw new Error(`Please upload a photo smaller than ${process.env.MAX_FILE_UPLOAD_SIZE}.`)
    file.name = `photo_${bootcamp._id}${parse(file.name).ext}`
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async error => {
        if(error) {
            console.error(error)
            throw new Error('File upload error.')
        }
        await bootcampModel.findByIdAndUpdate(request.params.id, {photo: file.name})
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
export const editBootcamp = asyncHandler(async(request, response, next) => {
    let bootcamp = await bootcampModel.findById(request.params.id)
    if(!bootcamp) throw new Error(`Bootcamp with ID of ${request.params.id} not found.`)
    if(bootcamp.user.toString() !== request.user.id && request.user.role !== 'admin') throw new Error('Not authorized.')
    bootcamp = await bootcampModel.findByIdAndUpdate(request.params.id, request.body, {
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

export const deleteBootcamp = asyncHandler(async(request, response, next) => {
    const bootcamp = await bootcampModel.findById(request.params.id)
    if(!bootcamp) throw new Error(`Bootcamp with ID of ${request.params.id} not found.`)
    if(bootcamp.user.toString() !== request.user.id && request.user.role !== 'admin') throw new Error('Not authorized.')
    await bootcamp.remove()
    response.status(200).json({success: true})
})