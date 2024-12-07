class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode || 500;
    this.success = false;
    this.data = null;
    this.errors = errors;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default ApiError;
