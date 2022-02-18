import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtHelper } from '../helper/jwt.helper';
import { GenericException } from '../exception/generic.exception';
import { ErrorMessageCodes } from '../exception/error_messages';

@Injectable()
export class JwtAccessTokenAuthGuard implements CanActivate {
  constructor(private readonly jwtHelper: JwtHelper) {}

  private static readonly AUTHORIZATION_HEADER = 'authorization';
  private static readonly AUTHORIZATION_HEADER_START = 'Bearer ';

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const authorizationHeader =
      http.getRequest().headers[JwtAccessTokenAuthGuard.AUTHORIZATION_HEADER];

    if (!authorizationHeader) {
      throw new GenericException(
        HttpStatus.UNAUTHORIZED,
        ErrorMessageCodes.MISSING_TOKEN,
      );
    }

    const accessToken = authorizationHeader.slice(
      JwtAccessTokenAuthGuard.AUTHORIZATION_HEADER_START.length,
    );

    return this.jwtHelper.validateToken(accessToken);
  }
}
