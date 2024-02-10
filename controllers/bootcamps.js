// @desc    display all forthcoming bootcamps
// @route   GET /api/v1/bootcamps
// @access  public
exports.getBootcamps = (request, response, next) => {
    response.status(200).json({ success: true, purpose: 'Display all forthcoming bootcamps' })
}
// @desc    display a single bootcamp
// @route   GET /api/v1/bootcamps/:id
// access   public
exports.getBootcamp = (request, response, next) => {
    response.status(200).json({ success: true, purpose: `Display bootcamp ${request.params.id}` })
}
// @desc    add a bootcamp
// @route   POST /api/v1/bootcamps
// access   private
exports.addBootcamp = (request, response, next) => {
    response.status(200).json({ success: true, purpose: 'Add a bootcamp' })
}
// @desc    update a bootcamp
// @route   PATCH /api/v1/bootcamps/:id
// access   pricate
exports.updateBootcamp = (request, response, next) => {
    response.status(200).json({ success: true, purpose: `Update bootcamp ${request.params.id}` })
}
// @desc    delete a bootcamp
// @route   DELETE /api/v1/bootcamps/:id
// @access  private
exports.deleteBootcamp = (request, response, next) => {
    response.status(200).json({ success: true, purpose: `Delete bootcamp ${request.params.id}` })
}