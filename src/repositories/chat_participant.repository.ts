import { EntityRepository, Repository } from 'typeorm';
import {
  ChatParticipant,
  ChatParticipant_,
} from '../model/entity/chat_participant.entity';

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

  public async getOtherParticipantUserId(params: {
    chatId: number;
    userId: number;
  }): Promise<number> {
    const result = await this.createQueryBuilder(ChatParticipant_.TN)
      .select(
        `${ChatParticipant_.TN}.${ChatParticipant_.USER_ID}`,
        `${ChatParticipant_.TN}_${ChatParticipant_.USER_ID}`,
      )
      .where(`${ChatParticipant_.TN}.${ChatParticipant_.CHAT_ID} = :chatId`)
      .andWhere(`${ChatParticipant_.TN}.${ChatParticipant_.USER_ID} != :userId`)
      .setParameters(params)
      .getRawOne();

    return result[`${ChatParticipant_.TN}_${ChatParticipant_.USER_ID}`];
  }
}
