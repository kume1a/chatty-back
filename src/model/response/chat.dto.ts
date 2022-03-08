import { UserDto } from './user.dto';
import { ChatMessageDto } from './chat-message.dto';

export class ChatDto {
  constructor(
    readonly id: number,
    readonly createdAt: Date,
    readonly user: UserDto,
    readonly lastMessage: ChatMessageDto,
  ) {}
}
