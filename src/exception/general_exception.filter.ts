import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { GenericException, GenericExceptionProps } from './generic.exception';

@Catch()
export class GeneralExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    console.error(exception);
    const httpAdapter = this.httpAdapterHost?.httpAdapter;
    const ctx = host.switchToHttp();

    if (exception instanceof GenericException) {
      const exceptionResponse =
        exception.getResponse() as GenericExceptionProps;
      const statusCode =
        exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;

      return httpAdapter.reply(
        ctx.getResponse(),
        {
          message: exceptionResponse?.message ?? '',
          messageCode:
            exceptionResponse?.messageCode ?? 'INTERNAL_SERVER_ERROR',
          statusCode,
        },
        statusCode,
      );
    }

    if (exception instanceof HttpException) {
      const exceptionResponseBody = exception.getResponse() as any;
      const statusCode =
        exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = Array.isArray(exceptionResponseBody?.message)
        ? exceptionResponseBody?.message[0]
        : null;

      return httpAdapter.reply(
        ctx.getResponse(),
        {
          message: message ?? exception.message,
          messageCode: 'INTERNAL_SERVER_ERROR',
          statusCode,
        },
        statusCode,
      );
    }

    return httpAdapter.reply(
      ctx.getResponse(),
      {
        message: 'internal server error',
        messageCode: 'INTERNAL_SERVER_ERROR',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
