export class Response<T> {
  success: boolean;
  data: T | null;
  error: string;
  statusCode: number;

  constructor(success: boolean, data: T | null, statusCode = 200, error = "") {
    this.success = success;
    this.data = data;
    this.error = error;
    this.statusCode = statusCode;
  }
}
