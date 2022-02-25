import { EntityRepository, Repository } from 'typeorm';
import { Chat, Chat_ } from '../model/entity/chat.entity';
import { ChatMessage, ChatMessage_ } from '../model/entity/chat_message.entity';
import { ChatParticipant_ } from '../model/entity/chat_participant.entity';
import { User_ } from '../model/entity/user.entity';

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
    const query = this.createQueryBuilder(Chat_.TN)
      .leftJoin(
        (qb) => qb.from(ChatMessage, ChatMessage_.TN).take(1),
        ChatMessage_.TN,
        `${ChatMessage_.TN}."${ChatMessage_.CHAT_ID}" = ${Chat_.TN}.${Chat_.ID}`,
      )
      .leftJoin(
        `${Chat_.TN}.${Chat_.RL_CHAT_PARTICIPANTS}`,
        ChatParticipant_.TN,
      )
      .leftJoin(`${ChatParticipant_.TN}.${ChatParticipant_.RL_USER}`, User_.TN)
      .select([
        `${Chat_.TN}.${Chat_.ID}`,
        `${Chat_.TN}.${Chat_.NAME}`,
        `${Chat_.TN}.${Chat_.CREATED_AT}`,
        `${User_.TN}.${User_.ID}`,
        `${User_.TN}.${User_.FIRST_NAME}`,
        `${User_.TN}.${User_.LAST_NAME}`,
        `${User_.TN}.${User_.PROFILE_IMAGE_URL}`,
        `${ChatMessage_.TN}.*`,
      ])
      .where(`${ChatParticipant_.TN}.${ChatParticipant_.USER_ID} = :userId`);
    if (lastId) {
      query.andWhere(`${Chat_.TN}.${Chat_.ID} > :lastId`);
    }

    // console.log(
    //   query.setParameters({ lastId, userId }).take(takeCount).getSql(),
    // );
    // console.log(
    //   await query
    //     .setParameters({ lastId, userId })
    //     .take(takeCount)
    //     .getRawMany(),
    // );
    return query.setParameters({ lastId, userId }).take(takeCount).getMany();
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

  public async getChatByUserId(userId: number): Promise<Chat> {
    return this.createQueryBuilder(Chat_.TN)
      .select([`${Chat_.TN}.${Chat_.ID}`, `${Chat_.TN}.${Chat_.CREATED_AT}`])
      .leftJoin(
        `${Chat_.TN}.${Chat_.RL_CHAT_PARTICIPANTS}`,
        ChatParticipant_.TN,
      )
      .where(`${ChatParticipant_.TN}.${ChatParticipant_.USER_ID} = :userId`)
      .setParameters({ userId })
      .getOne();
  }

  public async createChat(params: { name: string }): Promise<Chat> {
    const chat = this.create({ name: params.name });

    return this.save(chat);
  }
}
