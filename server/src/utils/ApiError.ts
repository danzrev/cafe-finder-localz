/** An operation error with an HTTP status; serialized by the error middleware. */
export class ApiError extends Error {
  readonly statusCode: number;
  readonly fieldErrors?: Record<string, string>;

  constructor(statusCode: number, message: string, fieldErrors?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
  }

  static badRequest(message: string, fieldErrors?: Record<string, string>): ApiError {
    return new ApiError(400, message, fieldErrors);
  }

  static unauthorized(message = 'Please log in to continue.'): ApiError {
    return new ApiError(401, message);
  }

  static forbidden(message = 'You don’t have access to do that.'): ApiError {
    return new ApiError(403, message);
  }

  static notFound(message = 'That resource could not be found.'): ApiError {
    return new ApiError(404, message);
  }

  static conflict(message: string): ApiError {
    return new ApiError(409, message);
  }
}