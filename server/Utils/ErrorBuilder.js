class ErrorBuilder extends Error {
  static Error;
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith("4") ? "fail" : "Error";

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = ErrorBuilder;
