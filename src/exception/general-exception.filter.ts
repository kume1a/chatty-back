import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  UnprocessableEntityException,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { GenericException, GenericExceptionProps } from './generic.exception';
import { ErrorMessageCode } from './error-message-code';

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
            exceptionResponse?.messageCode ??
            ErrorMessageCode.INTERNAL_SERVER_ERROR,
          statusCode,
        },
        statusCode,
      );
    }

    if (exception instanceof UnprocessableEntityException) {
      return httpAdapter.reply(
        ctx.getResponse(),
        {
          message: exception.message,
          messageCode: ErrorMessageCode.VALIDATION_ERROR,
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
          validationErrors: (exception.getResponse() as any)?.message,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (exception instanceof HttpException) {
      const statusCode =
        exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;

      return httpAdapter.reply(
        ctx.getResponse(),
        {
          message: exception.message,
          messageCode: ErrorMessageCode.INTERNAL_SERVER_ERROR,
          statusCode,
        },
        statusCode,
      );
    }

    return httpAdapter.reply(
      ctx.getResponse(),
      {
        message: 'internal server error',
        messageCode: ErrorMessageCode.INTERNAL_SERVER_ERROR,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
