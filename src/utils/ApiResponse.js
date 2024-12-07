class ApiResponse {
  constructor(statusCode, message, data = []) {
    this.name = this.constructor.name;
    this.message = message;
    this.statusCode = statusCode || 200;
    this.success = statusCode < 400;
    this.data = data;
  }
}
export default ApiResponse;
