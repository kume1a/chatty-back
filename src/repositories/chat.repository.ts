import { EntityRepository, Repository } from 'typeorm';
import { Chat, Chat_ } from '../model/entity/chat.entity';
import { ChatMessage, ChatMessage_ } from '../model/entity/chat_message.entity';
import { ChatParticipant_ } from '../model/entity/chat_participant.entity';

@EntityRepository(Chat)
export class ChatRepository extends Repository<Chat> {
  public async getChats({
    userId,
    lastId,
    takeCount,
  }: {
    userId: number;
    lastId: number;
    takeCount: number;
  }): Promise<Chat[]> {
    return this.createQueryBuilder(Chat_.TN)
      .innerJoin(
        (qb) => qb.from(ChatMessage, ChatMessage_.TN).limit(1),
        ChatMessage_.TN,
        `${ChatMessage_.TN}.${ChatMessage_.CHAT_ID} = ${Chat_.TN}.${Chat_.ID}`,
      )
      .leftJoin(
        `${Chat_.TN}.${Chat_.RL_CHAT_PARTICIPANTS}`,
        ChatParticipant_.TN,
      )
      .where(`${ChatParticipant_.TN}.${ChatParticipant_.USER_ID} = :userId`)
      .andWhere(`${Chat_.ID} > :lastId`)
      .setParameters({ lastId, userId })
      .take(takeCount)
      .getMany();
  }

  public async countForUser(userId: number): Promise<number> {
    return this.createQueryBuilder(Chat_.TN)
      .leftJoin(
        `${Chat_.TN}.${Chat_.RL_CHAT_PARTICIPANTS}`,
        ChatParticipant_.TN,
      )
      .where(`${ChatParticipant_.TN}.${ChatParticipant_.USER_ID} = :userId`)
      .setParameters({ userId })
      .getCount();
  }
}
