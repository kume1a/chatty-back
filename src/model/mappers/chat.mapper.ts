import { Chat } from '../entity/chat.entity';
import { ChatDto } from '../response/chat.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatMapper {
  public mapToRight(l: Chat): Promise<ChatDto> | ChatDto {
    return new ChatDto(l.id, null, null);
  }
}
