import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { ChatMessageDto } from '../../model/response/chat-message.dto';
import { SocketEvent } from './socket.event';
import { UserService } from '../user/user.service';

@Injectable()
export class SocketService {
  constructor(private readonly userService: UserService) {}

  private _server: Server = null;

  public set server(server: Server) {
    this._server = server;
  }

  public async emitChatMessageTo(params: {
    chatMessage: ChatMessageDto;
    userId: number;
  }) {
    const socketId = await this.userService.getSocketId(params.userId);

    this._server
      .to(socketId)
      .emit(SocketEvent.MESSAGE_SENT_TO_CLIENT, params.chatMessage);
  }
}
