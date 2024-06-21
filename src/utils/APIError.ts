import httpStatus, {HttpStatus} from "http-status";

interface ExtraInfo {
  [key: string]: any;
}

class APIError extends Error {
  status: number;
  extra: ExtraInfo | null;
  constructor(
    message: string,
    status:number = httpStatus.INTERNAL_SERVER_ERROR,
    extra = null
  ) {
    super(message);
    this.name = this.constructor.name;
    this.status = status;
    this.extra = extra;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default APIError;
