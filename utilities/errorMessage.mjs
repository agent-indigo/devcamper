class httpError extends Error {
    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode
    }
}
const errorMessage = new httpError()
export default errorMessage