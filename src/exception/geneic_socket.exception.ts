import { WsException } from '@nestjs/websockets';
import { ErrorMessageCode } from './error_messages';

export class GenericSocketException extends WsException {
  constructor(messageCode: ErrorMessageCode, message?: string) {
    const generalExceptonProps: { messageCode: string; message: string } = {
      messageCode,
      message,
    };

    super(generalExceptonProps);
  }
}
