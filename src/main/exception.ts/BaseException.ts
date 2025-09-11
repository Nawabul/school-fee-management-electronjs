abstract class BaseException extends Error {
  public readonly message: string
  public readonly statusCode: number
  public readonly details?: unknown

  constructor(message: string, statusCode: number = 500, details?: unknown) {
    super(message)
    this.message = message
    this.statusCode = statusCode
    this.details = details

    // Ensures the correct prototype chain for `instanceof`
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export default BaseException
