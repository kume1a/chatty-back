import { HttpException, HttpStatus } from '@nestjs/common';

export interface GenericExceptionProps {
  message: string;
  messageCode: string;
  statusCode: HttpStatus;
}

export class GenericException extends HttpException {
  constructor(statusCode: HttpStatus, messageCode: string, message?: string) {
    const genericExceptionProps: GenericExceptionProps = {
      statusCode,
      messageCode,
      message,
    };

    super(genericExceptionProps, statusCode);
  }
}
