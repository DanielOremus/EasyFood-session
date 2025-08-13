class CustomError extends Error {
  constructor(message, code) {
    super(message)
    this.code = code
    this.name = this.constructor.name
    Error.captureStackTrace(this, this.constructor)
  }
}

export default CustomError
