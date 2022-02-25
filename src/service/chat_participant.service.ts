import { Injectable } from '@nestjs/common';
import { ChatParticipantRepository } from '../repositories/chat_participant.repository';

@Injectable()
export class ChatParticipantService {
  constructor(
    private readonly chatParticipantRepository: ChatParticipantRepository,
  ) {}

  public async createChatParticipant(params: {
    userId: number;
    chatId: number;
  }) {
    return this.chatParticipantRepository.createChatParticipant({
      userId: params.userId,
      chatId: params.chatId,
    });
  }
}
