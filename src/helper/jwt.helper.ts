import { HttpStatus, Injectable } from '@nestjs/common';
import { environment } from '../environment';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { GenericException } from '../exception/generic.exception';
import { ErrorMessageCodes } from '../exception/error_messages';
import { UserPayload } from '../model/common/user_payload';

@Injectable()
export class JwtHelper {
  constructor(private readonly jwtService: JwtService) {}

  public generateAccessToken({ userId }: { userId: number }): string {
    const payload = { userId };

    return this.jwtService.sign(payload, {
      expiresIn: environment.accessTokenExpiration,
      secret: environment.accessTokenSecret,
    });
  }

  public async validateToken(token: string): Promise<boolean> {
    await jwt.verify(
      token,
      environment.accessTokenSecret,
      async (err: jwt.VerifyErrors) => {
        if (err instanceof jwt.TokenExpiredError) {
          throw new GenericException(
            HttpStatus.UNAUTHORIZED,
            ErrorMessageCodes.EXPIRED_TOKEN,
            err.message,
          );
        }

        if (err instanceof jwt.JsonWebTokenError) {
          throw new GenericException(
            HttpStatus.UNAUTHORIZED,
            ErrorMessageCodes.INVALID_TOKEN,
            err.message,
          );
        }
      },
    );

    return true;
  }

  public async getUserPayload(
    jwtToken: string,
  ): Promise<UserPayload | undefined> {
    const payload = this.jwtService.decode(jwtToken);

    if (
      !payload ||
      typeof payload !== 'object' ||
      typeof payload?.userId !== 'number' ||
      typeof payload?.iat !== 'number' ||
      typeof payload?.exp !== 'number'
    ) {
      return undefined;
    }

    return {
      userId: payload.userId,
      issuedAt: payload.iat,
      expirationTime: payload.exp,
    };
  }
}
