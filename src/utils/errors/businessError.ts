import { StatusCode } from "../../models/enums";
import { ErrorList } from "../../models/errorcodes";

export default class BusinessError extends Error {
  status: string;
  isOperational: boolean;
  errorCode: string;

  constructor(public error_Code = '', public message = '') {
    // TODO errorcode to error message

    super(message);
    this.status = StatusCode.Error;
    this.isOperational = true;
    this.errorCode = error_Code;

    Error.captureStackTrace(this, this.constructor);
  }
}
