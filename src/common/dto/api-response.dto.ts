export class ApiResponseDto<T> {
    data: T;
    message: string;
    status: number;
  
    constructor(data: T, message = 'Success', status = 200) {
      this.data = data;
      this.message = message;
      this.status = status;
    }
  }
  