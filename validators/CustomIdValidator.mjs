import CustomError from "../utils/CustomError.mjs"

class CustomIdValidator {
  constructor(idAlias = "ID", customMessages = {}) {
    this.idAlias = idAlias
    this.errorCodes = this.getErrorCodesMessages(customMessages)
  }
  getErrorCodesMessages(customMessages) {
    return {
      NOT_PROVIDED: `${this.idAlias} is required`,
      NOT_INT: `${this.idAlias} must be an integer`,
      NEGATIVE_INT: `${this.idAlias} cannot be negative`,
      UNSUPPORTED_TYPE: `${this.idAlias} must be a string or number`,
      ...customMessages,
    }
  }
  validate(id) {
    let sanitizedValue = typeof id === "string" ? id.trim() : id

    if (sanitizedValue === null || sanitizedValue === "")
      throw new CustomError(this.errorCodes.NOT_PROVIDED, "NOT_PROVIDED")

    const numericValue = Number(sanitizedValue)

    if (isFinite(numericValue)) {
      if (!Number.isInteger(numericValue))
        throw new CustomError(this.errorCodes.NOT_INT, "NOT_INT")
      if (numericValue < 0)
        throw new CustomError(this.errorCodes.NEGATIVE_INT, "NEGATIVE_INT")

      sanitizedValue = numericValue
    } else {
      if (typeof sanitizedValue !== "string")
        throw new CustomError(
          this.errorCodes.UNSUPPORTED_TYPE,
          "UNSUPPORTED_TYPE"
        )
    }
    return sanitizedValue
  }
}

export default CustomIdValidator
