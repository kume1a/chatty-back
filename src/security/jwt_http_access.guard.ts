import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtHelper } from '../helper/jwt.helper';
import { GenericException } from '../exception/generic.exception';
import { ErrorMessageCode } from '../exception/error_messages';
import { JwtTokenExtractor } from '../helper/jwt_token.extractor';

@Injectable()
export class JwtHttpAccessGuard implements CanActivate {
  constructor(
    private readonly jwtHelper: JwtHelper,
    private readonly jwtTokenExtractor: JwtTokenExtractor,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const accessToken = this.jwtTokenExtractor.extractJwtToken(
      context.switchToHttp().getRequest().headers,
    );

    if (!accessToken) {
      throw new GenericException(
        HttpStatus.UNAUTHORIZED,
        ErrorMessageCode.MISSING_TOKEN,
      );
    }

    return this.jwtHelper.validateToken({
      token: accessToken,
      isSocket: false,
    });
  }
}
