export enum ErrorMessageCodes {
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
  INVALID_TOKEN = 'INVALID_TOKEN',
  MISSING_TOKEN = 'MISSING_TOKEN',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  EMAIL_OR_PASSWORD_INVALID = 'EMAIL_OR_PASSWORD_INVALID',
  MISSING_CURRENT_USER_PAYLOAD = 'MISSING_CURRENT_USER_PAYLOAD',
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
}
