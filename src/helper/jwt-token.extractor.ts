import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtTokenExtractor {
  private static readonly AUTHORIZATION_HEADER_START = 'Bearer ';

  public extractJwtToken(headers: Headers): string | undefined {
    const authorizationHeader =
      headers['authorization'] || headers['Authorization'];
    if (!authorizationHeader) {
      return undefined;
    }

    return authorizationHeader.slice(
      JwtTokenExtractor.AUTHORIZATION_HEADER_START.length,
    );
  }
}
