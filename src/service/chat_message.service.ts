import { Injectable } from '@nestjs/common';
import { ChatMessageRepository } from '../repositories/chat_message.repository';
import { PaginatedResponseDto } from '../model/response/core/paginated_response.dto';
import { ChatMessageDto } from '../model/response/chat_message.dto';
import { ChatMessageMapper } from '../model/mappers/chat_message.mapper';

@Injectable()
export class ChatMessageService {
  constructor(
    private readonly chatMessageRepository: ChatMessageRepository,
    private readonly chatMessageMapper: ChatMessageMapper,
  ) {}

  public async sendMessage(params: {
    chatId: number;
    userId: number;
    textMessage?: string | undefined;
    imageFilePath?: string | undefined;
    voiceFilePath?: string | undefined;
    videoFilePath?: string | undefined;
  }) {
    const message = await this.chatMessageRepository.createMessage({
      chatId: params.chatId,
      userId: params.userId,
      textMessage: params.textMessage,
      imageFilePath: params.imageFilePath,
      voiceFilePath: params.voiceFilePath,
      videoFilePath: params.videoFilePath,
    });

    return this.chatMessageMapper.mapToRight(message);
  }

  public async getMessages({
    chatId,
    takeCount,
    lastId,
  }: {
    chatId: number;
    takeCount: number;
    lastId?: number | undefined;
  }): Promise<PaginatedResponseDto<ChatMessageDto>> {
    const chatMessages = await this.chatMessageRepository.getMessages({
      chatId,
      takeCount,
      lastId,
    });
    const count = await this.chatMessageRepository.getCount(chatId);

    const mappedMessages = await Promise.all(
      chatMessages.map(this.chatMessageMapper.mapToRight),
    );

    return {
      data: mappedMessages,
      count: count,
    };
  }
}
