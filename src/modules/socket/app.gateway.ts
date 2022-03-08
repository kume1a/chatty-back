import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';
import { UseGuards } from '@nestjs/common';
import { JwtSocketAccessGuard } from '../../security/jwt-socket-access.guard';
import { JwtHelper } from '../../helper/jwt.helper';

@UseGuards(JwtSocketAccessGuard)
@WebSocketGateway({ namespace: '/app' })
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly socketService: SocketService,
    private readonly jwtHelper: JwtHelper,
  ) {}

  @WebSocketServer() public server: Server;

  afterInit(server: Server) {
    this.socketService.server = server;
  }

  async handleConnection(@ConnectedSocket() client: Socket) {
    const token = client.handshake.auth?.token;
    const userPayload = await this.jwtHelper.getUserPayload(token);

    client.join(userPayload.socketId);
  }

  async handleDisconnect(@ConnectedSocket() client: Socket) {
    const token = client.handshake.auth?.token;
    const userPayload = await this.jwtHelper.getUserPayload(token);

    console.log('user disconnect ' + userPayload.userId);
  }
}
