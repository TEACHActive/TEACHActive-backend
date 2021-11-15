export class Response<T> {
  success: boolean;
  data: T | null;
  errorMessage: string;
  statusCode: number;
  detail?: any;

  constructor(
    success: boolean,
    data: T | null,
    statusCode: number = 200,
    errorMessage: string = "",
    detail: any = ""
  ) {
    this.success = success;
    this.data = data;
    this.errorMessage = errorMessage;
    this.statusCode = statusCode;
    this.detail = detail;
  }
}

export enum MethodType {
  Post = "post",
  Get = "get",
  Put = "put",
}
