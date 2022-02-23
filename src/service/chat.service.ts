import { Injectable } from '@nestjs/common';
import { ChatRepository } from '../repositories/chat.repository';
import { ChatDto } from '../model/response/chat.dto';
import { UserDto } from '../model/response/user.dto';
import { ChatMessageDto } from '../model/response/chat_message.dto';
import { PaginatedResponseDto } from '../model/response/core/paginated_response.dto';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

  public async getChats({
    userId,
    lastId,
    takeCount,
  }: {
    userId: number;
    lastId: number;
    takeCount: number;
  }): Promise<PaginatedResponseDto<ChatDto>> {
    const chats = await this.chatRepository.getChats({
      userId,
      lastId,
      takeCount,
    });

    const totalCount = await this.chatRepository.countForUser(userId);

    return {
      data: chats.map(
        (e) =>
          new ChatDto(
            e.id,
            new UserDto(1, '', '', ''),
            new ChatMessageDto(0, '', '', '', '', '', new Date()),
          ),
      ),
      count: totalCount,
    };
  }
}
