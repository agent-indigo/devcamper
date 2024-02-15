const AdvancedResults = (model, populate) => async (request, response, next) => {
    let query
    // copy request query
    const requestQuery = { ...request.query }
    // fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit']
    // delete fields from request query
    removeFields.forEach(field => delete requestQuery[field])
    // create query string
    let queryString = JSON.stringify(requestQuery)
    // match by regex
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
    // find resources
    query = model.find(JSON.parse(queryString))
    // select fields
    if(request.query.select) {
        const fields =  request.query.select.split(',').join(' ')
        query = query.select(fields)
    }
    // sort
    if(request.query.sort) {
        const sortBy = request.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdOn')
    }
    // pagination
    const page = parseInt(request.query.page, 10) || 1
    const limit = parseInt(request.query.limit, 10) || 25
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await model.countDocuments()
    query = query.skip(startIndex).limit(limit)
    // populate
    if(populate) query = query.populate(populate)
    // run query
    const results = await query
    // pagination result
    const pagination = {}
    if(endIndex < total) pagination.next = {
        page: page + 1,
        limit
    }
    if(startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }
    response.AdvancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    }
    next()
}
module.exports = AdvancedResults