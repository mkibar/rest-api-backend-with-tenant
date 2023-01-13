export default class AppError extends Error {
  status: string;
  isOperational: boolean;
  errorCode: string;

  constructor(public message: string, public statusCode: number = 500, public error_Code ='') {
    super(message);
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    this.errorCode = error_Code;

    Error.captureStackTrace(this, this.constructor);
  }
}
