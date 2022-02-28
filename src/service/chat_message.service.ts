import { Injectable } from '@nestjs/common';
import { ChatMessageRepository } from '../repositories/chat_message.repository';
import { PaginatedResponseDto } from '../model/response/core/paginated_response.dto';
import { ChatMessageDto } from '../model/response/chat_message.dto';
import { ChatMessageMapper } from '../model/mappers/chat_message.mapper';
import { SocketService } from './socket.service';
import { ChatParticipantService } from './chat_participant.service';
import { MessageType } from '../model/enums/message_type.enum';
import { ImageHelper } from '../helper/image.helper';
import { ImageMetaRepository } from '../repositories/image_meta.repository';
import { ImageMeta } from '../model/entity/image_meta.entity';
import { getFileName } from '../common/utils/string.utils';

@Injectable()
export class ChatMessageService {
  constructor(
    private readonly chatMessageRepository: ChatMessageRepository,
    private readonly chatMessageMapper: ChatMessageMapper,
    private readonly socketService: SocketService,
    private readonly chatParticipantService: ChatParticipantService,
    private readonly imageHelper: ImageHelper,
    private readonly imageMetaRepository: ImageMetaRepository,
  ) {}

  public async sendMessage(p: {
    chatId: number;
    userId: number;
    textMessage?: string | undefined;
    imageFilePath?: string | undefined;
    voiceFilePath?: string | undefined;
    videoFilePath?: string | undefined;
  }) {
    let messageType = MessageType.TEXT;
    if (p.imageFilePath) {
      messageType = MessageType.IMAGE;
    } else if (p.voiceFilePath) {
      messageType = MessageType.VOICE;
    } else if (p.videoFilePath) {
      messageType = MessageType.VIDEO;
    }

    const message = await this.chatMessageRepository.createMessage({
      chatId: p.chatId,
      userId: p.userId,
      messageType: messageType,
      textMessage: p.textMessage,
      imageFilePath: getFileName(p.imageFilePath),
      voiceFilePath: getFileName(p.voiceFilePath),
      videoFilePath: getFileName(p.videoFilePath),
    });

    let imageMeta: ImageMeta | undefined;
    if (messageType == MessageType.IMAGE) {
      const imageSize = await this.imageHelper.getSize(p.imageFilePath);

      imageMeta = await this.imageMetaRepository.saveEntity({
        chatMessageId: message.id,
        width: imageSize.width,
        height: imageSize.height,
      });
    }

    const messageDto = await this.chatMessageMapper.mapToRight(
      message,
      imageMeta,
    );

    const otherUserId = await this.chatParticipantService.getPartnerUserId(p);
    await this.socketService.emitChatMessageTo({
      userId: otherUserId,
      chatMessage: messageDto,
    });

    return messageDto;
  }

  public async getMessages(p: {
    chatId: number;
    takeCount: number;
    lastId?: number | undefined;
  }): Promise<PaginatedResponseDto<ChatMessageDto>> {
    const chatMessages = await this.chatMessageRepository.getMessages({
      chatId: p.chatId,
      takeCount: p.takeCount,
      lastId: p.lastId,
    });
    const count = await this.chatMessageRepository.getCount(p.chatId);

    const mappedMessages = await Promise.all(
      chatMessages.map((e) => this.chatMessageMapper.mapToRight(e)),
    );

    return {
      data: mappedMessages,
      count: count,
    };
  }
}
