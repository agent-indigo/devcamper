class httpError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
    }
}
const errorMessage = (message, statusCode) => {
    return new httpError(message, statusCode)
}
export default errorMessage