import { SimpleMapper } from '../../common/simple_mapper';
import { ChatMessage } from '../entity/chat_message.entity';
import { ChatMessageDto } from '../response/chat_message.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ChatMessageMapper extends SimpleMapper<
  ChatMessage,
  ChatMessageDto
> {
  public mapToRight(l: ChatMessage): Promise<ChatMessageDto> | ChatMessageDto {
    return new ChatMessageDto(
      l.id,
      l.messageType.type,
      l.textMessage,
      l.imageUrl,
      l.videoUrl,
      l.gifURl,
      l.createdAt,
    );
  }
}