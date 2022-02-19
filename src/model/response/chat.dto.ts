import { UserDto } from './user.dto';
import { ChatMessageDto } from './chat_message.dto';

export class ChatDto {
  constructor(
    readonly id: number,
    readonly user: UserDto,
    readonly lastMessage: ChatMessageDto,
  ) {}
}
