import { ChatMessage } from '../entity/chat_message.entity';
import { ChatMessageDto } from '../response/chat_message.dto';
import { Injectable } from '@nestjs/common';
import { ImageMeta } from '../entity/image_meta.entity';

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
