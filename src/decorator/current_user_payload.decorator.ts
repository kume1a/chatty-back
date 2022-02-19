import {
  createParamDecorator,
  ExecutionContext,
  HttpStatus,
} from '@nestjs/common';
import { UserPayloadRequest } from '../interceptor/current_user_payload.interceptor';
import { GenericException } from '../exception/generic.exception';
import { ErrorMessageCodes } from '../exception/error_messages';

export const CurrentUserPayload = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest() as UserPayloadRequest;

    if (!request.userPayload) {
      throw new GenericException(
        HttpStatus.BAD_REQUEST,
        ErrorMessageCodes.MISSING_CURRENT_USER_PAYLOAD,
      );
    }

    return request?.userPayload;
  },
);
