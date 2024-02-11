const Bootcamp = require('../models/Bootcamp')
// @desc    display all forthcoming bootcamps
// @route   GET /api/v1/bootcamps
// @access  public
exports.getBootcamps = async (request, response, next) => {
    try {
        const bootcamps = await Bootcamp.find()
        response.status(200).json({
            success: true,
            data: bootcamps
        })
    } catch(error) {
        response.status(400).json({ success: false })
    }
}
// @desc    display a single bootcamp
// @route   GET /api/v1/bootcamps/:id
// access   public
exports.getBootcamp = async (request, response, next) => {
    try {
        const bootcamp = await Bootcamp.findById(request.params.id)
        if(!bootcamp) return response.status(400).json({ success: false })
        response.status(200).json({
            success: true,
            data: bootcamp
        })
    } catch(error) {
        response.status(400).json({ success: false })
    }
}
// @desc    add a bootcamp
// @route   POST /api/v1/bootcamps
// access   private
exports.addBootcamp = async (request, response, next) => {
    try {
        console.log(request.body)
        const bootcamp = await Bootcamp.create(request.body)
        response.status(201).json({
            success: true,
            data: bootcamp
        })
    } catch(error) {
        response.status(400).json({ success: false })
    }
}
// @desc    update a bootcamp
// @route   PATCH /api/v1/bootcamps/:id
// access   pricate
exports.updateBootcamp = async (request, response, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(request.params.id, request.body, {
            new: true,
            runValidators: true
        })
        if(!bootcamp) return response.status(400).json({ success: false })
        response.status(200).json({
            success: true,
            data: bootcamp
        })
    } catch(error) {
        response.status(400).json({ success: false })
    }
}
// @desc    delete a bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  private
exports.deleteBootcamp = async (request, response, next) => {
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(request.params.id)
        if(!bootcamp) return response.status(400).json({ success: false })
        response.status(200).json({ success: true })
    } catch(error) {
        response.status(400).json({ success: false })
    }
}