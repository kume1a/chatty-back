import { ChatMessage } from '../entity/chat-message.entity';
import { ChatMessageDto } from '../response/chat-message.dto';
import { Injectable } from '@nestjs/common';
import { ImageMeta } from '../entity/image-meta.entity';

@Injectable()
export class ChatMessageMapper {
  public mapToRight(
    chatMessage: ChatMessage,
    imageMeta?: ImageMeta | undefined,
  ): Promise<ChatMessageDto> | ChatMessageDto {
    return new ChatMessageDto(
      chatMessage.id,
      chatMessage.userId,
      chatMessage.chatId,
      chatMessage.messageType,
      chatMessage.textMessage,
      chatMessage.imageFilePath,
      chatMessage.videoFilePath,
      chatMessage.voiceFilePath,
      chatMessage.gifURl,
      chatMessage.createdAt,
      imageMeta || chatMessage.imageMeta
        ? {
            width: imageMeta?.width || chatMessage.imageMeta?.width,
            height: imageMeta?.height || chatMessage.imageMeta?.height,
          }
        : undefined,
    );
  }
}
