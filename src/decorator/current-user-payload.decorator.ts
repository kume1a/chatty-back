import {
  createParamDecorator,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { UserPayloadRequest } from '../interceptor/current-user-payload.interceptor';
import { GenericException } from '../exception/generic.exception';
import { ErrorMessageCode } from '../exception/error-message-code';

export const CurrentUserPayload = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest() as UserPayloadRequest;

    if (!request.userPayload) {
      throw new GenericException(
        HttpStatus.BAD_REQUEST,
        ErrorMessageCode.MISSING_CURRENT_USER_PAYLOAD,
      );
    }

    return request?.userPayload;
  },
);
