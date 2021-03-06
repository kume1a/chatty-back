import { Injectable } from '@nestjs/common';
import { ChatRepository } from './chat.repository';
import { ChatDto } from '../../model/response/chat.dto';
import { PaginatedResponseDto } from '../../model/response/core/paginated-response.dto';
import { ChatMapper } from '../../model/mappers/chat.mapper';
import { ChatParticipantService } from './chat-participant/chat-participant.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRepository: ChatRepository,
    private readonly chatMapper: ChatMapper,
    private readonly chatParticipantService: ChatParticipantService,
  ) {}

  public async getChats({
    userId,
    page,
    pageSize,
  }: {
    userId: number;
    page: number;
    pageSize: number;
  }): Promise<PaginatedResponseDto<ChatDto>> {
    const chats = await this.chatRepository.getChats({
      userId,
      page,
      pageSize,
    });
    const totalCount = await this.chatRepository.countForUser(userId);

    const data = await Promise.all(chats.map(this.chatMapper.mapFromEntryView));

    return {
      data: data,
      count: totalCount,
    };
  }

  public async createChat(params: {
    name?: string | undefined;
    participant1Id: number;
    participant2Id: number;
  }): Promise<ChatDto> {
    const chat = await this.chatRepository.createChat({ name: params.name });

    await this.chatParticipantService.createChatParticipant({
      chatId: chat.id,
      userId: params.participant1Id,
    });
    await this.chatParticipantService.createChatParticipant({
      chatId: chat.id,
      userId: params.participant2Id,
    });

    return this.chatMapper.mapFromEntity(chat);
  }

  public async getChatByUserId(userId: number): Promise<ChatDto | undefined> {
    const chat = await this.chatRepository.getChatByUserId(userId);

    if (!chat) {
      return undefined;
    }

    return this.chatMapper.mapFromEntity(chat);
  }
}
