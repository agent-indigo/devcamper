import asyncHandler from './asyncHandler.mjs'
const searchFilter = (model, populate) => asyncHandler(async (request, response, next) => {
    let query
    const requestQuery = { ...request.query }
    const removeFields = ['select', 'sort', 'page', 'limit']
    removeFields.forEach(field => delete requestQuery[field])
    let queryString = JSON.stringify(requestQuery)
    queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`)
    query = model.find(JSON.parse(queryString))
    if(request.query.select) {
        const fields =  request.query.select.split(',').join(' ')
        query = query.select(fields)
    }
    if(request.query.sort) {
        const sortBy = request.query.sort.split(',').join(' ')
        query = query.sort(sortBy)
    } else {
        query = query.sort('-createdOn')
    }
    const page = parseInt(request.query.page, 10) || 1
    const limit = parseInt(request.query.limit, 10) || 25
    const startIndex = (page - 1) * limit
    const endIndex = page * limit
    const total = await model.countDocuments()
    query = query.skip(startIndex).limit(limit)
    if(populate) query = query.populate(populate)
    const results = await query
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
    response.filteredResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    }
    next()
})
export default searchFilter