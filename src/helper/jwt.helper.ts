import { HttpStatus, Injectable } from '@nestjs/common';
import { environment } from '../environment';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { GenericException } from '../exception/generic.exception';
import { ErrorMessageCode } from '../exception/error-message-code';
import { UserPayload } from '../model/common/user.payload';
import { GenericSocketException } from '../exception/geneic-socket.exception';

@Injectable()
export class JwtHelper {
  constructor(private readonly jwtService: JwtService) {}

  public generateAccessToken(params: {
    userId: number;
    socketId: string;
  }): string {
    const payload = { userId: params.userId, socketId: params.socketId };

    return this.jwtService.sign(payload, {
      expiresIn: environment.accessTokenExpiration,
      secret: environment.accessTokenSecret,
    });
  }

  public async validateToken(params: {
    token: string;
    isSocket: boolean;
  }): Promise<boolean> {
    if (!params.token) {
      if (params?.isSocket) {
        throw new GenericSocketException(ErrorMessageCode.MISSING_TOKEN);
      }

      throw new GenericException(
        HttpStatus.UNAUTHORIZED,
        ErrorMessageCode.MISSING_TOKEN,
      );
    }

    await jwt.verify(
      params.token,
      environment.accessTokenSecret,
      async (err: jwt.VerifyErrors) => {
        if (err instanceof jwt.TokenExpiredError) {
          if (params?.isSocket) {
            throw new GenericSocketException(
              ErrorMessageCode.EXPIRED_TOKEN,
              err.message,
            );
          }

          throw new GenericException(
            HttpStatus.UNAUTHORIZED,
            ErrorMessageCode.EXPIRED_TOKEN,
            err.message,
          );
        }

        if (params?.isSocket) {
          throw new GenericSocketException(
            ErrorMessageCode.INVALID_TOKEN,
            err.message,
          );
        }

        if (err instanceof jwt.JsonWebTokenError) {
          throw new GenericException(
            HttpStatus.UNAUTHORIZED,
            ErrorMessageCode.INVALID_TOKEN,
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
      typeof payload?.socketId !== 'string' ||
      typeof payload?.iat !== 'number' ||
      typeof payload?.exp !== 'number'
    ) {
      return undefined;
    }

    return {
      userId: payload.userId,
      socketId: payload.socketId,
      issuedAt: payload.iat,
      expirationTime: payload.exp,
    };
  }
}
