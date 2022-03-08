import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { JwtHelper } from '../helper/jwt.helper';

@Injectable()
export class JwtSocketAccessGuard implements CanActivate {
  constructor(private readonly jwtHelper: JwtHelper) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToWs();
    const token = request.getClient().handshake?.auth?.token;

    if (!token) {
      throw new WsException('Token missing');
    }

    await this.jwtHelper.validateToken({ isSocket: true, token });

    return true;
  }
}
