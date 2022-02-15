import { HttpStatus, Injectable } from '@nestjs/common';
import { environment } from '../environment';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import { GenericException } from '../exception/generic.exception';

@Injectable()
export class JwtHelper {
  constructor(private readonly jwtService: JwtService) {}

  public generateAccessToken({ userId }: { userId: number }): string {
    const payload = {
      userId,
    };

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
        // expired
        if (err instanceof jwt.TokenExpiredError) {
          throw new GenericException(
            HttpStatus.UNAUTHORIZED,
            'TOKEN_EXPIRED',
            err.message,
          );
        }

        if (err instanceof jwt.JsonWebTokenError) {
          throw new GenericException(
            HttpStatus.UNAUTHORIZED,
            'JWT_TOKEN_ERROR',
            err.message,
          );
        }
      },
    );

    return true;
  }
}
