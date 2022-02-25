import { EntityRepository, Repository } from 'typeorm';
import { ChatParticipant } from '../model/entity/chat_participant.entity';

@EntityRepository(ChatParticipant)
export class ChatParticipantRepository extends Repository<ChatParticipant> {
  public async createChatParticipant(params: {
    userId: number;
    chatId: number;
  }): Promise<ChatParticipant> {
    const participant = this.create({
      userId: params.userId,
      chatId: params.chatId,
    });

    return this.save(participant);
  }
}
