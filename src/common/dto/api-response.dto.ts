export type ResponseType = 'success' | 'error';

export class ApiResponseDto<T> {
  type: ResponseType;
  data?: T;
  message?: string;
  status: number;
  timestamp: Date;

  constructor(type: "success", data: T, message = 'Success', status = 200, timestamp = new Date()) {
    this.timestamp = timestamp;
    this.type = type;
    this.data = data;
    this.message = message;
    this.status = status;
  }
}
