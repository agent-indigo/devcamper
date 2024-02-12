const Bootcamp = require('../models/Bootcamp')
const AsyncHandler = require('../middleware/AsyncHandler')
// @desc    display all forthcoming bootcamps
// @route   GET /api/v1/bootcamps
// @access  public
exports.getBootcamps = AsyncHandler(async (request, response, next) => {
        const bootcamps = await Bootcamp.find()
        response.status(200).json({
            success: true,
            count: bootcamps.length,
            data: bootcamps
        })
})
// @desc    display a single bootcamp
// @route   GET /api/v1/bootcamps/:id
// access   public
exports.getBootcamp = AsyncHandler(async (request, response, next) => {
        const bootcamp = await Bootcamp.findById(request.params.id)
        if(!bootcamp) return next(error)
        response.status(200).json({
            success: true,
            data: bootcamp
        })
})
// @desc    add a bootcamp
// @route   POST /api/v1/bootcamps
// access   private
exports.addBootcamp = AsyncHandler(async (request, response, next) => {
        console.log(request.body)
        const bootcamp = await Bootcamp.create(request.body)
        response.status(201).json({
            success: true,
            data: bootcamp
        })
})
// @desc    update a bootcamp
// @route   PATCH /api/v1/bootcamps/:id
// access   pricate
exports.updateBootcamp = AsyncHandler(async (request, response, next) => {
        const bootcamp = await Bootcamp.findByIdAndUpdate(request.params.id, request.body, {
            new: true,
            runValidators: true
        })
        if(!bootcamp) return next(error)
        response.status(200).json({
            success: true,
            data: bootcamp
        })
})
// @desc    delete a bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  private
exports.deleteBootcamp = AsyncHandler(async (request, response, next) => {
        const bootcamp = await Bootcamp.findByIdAndDelete(request.params.id)
        if(!bootcamp) return next(error)
        response.status(200).json({ success: true })
})