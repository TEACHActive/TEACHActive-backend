export class Response<T> {
  success: boolean;
  data: T | null;
  error: string;
  statusCode: number;
  detail?: string;

  constructor(
    success: boolean,
    data: T | null,
    statusCode = 200,
    error = "",
    detail = ""
  ) {
    this.success = success;
    this.data = data;
    this.error = error;
    this.statusCode = statusCode;
    this.detail = detail;
  }
}
