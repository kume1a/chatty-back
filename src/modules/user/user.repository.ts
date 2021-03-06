import { EntityRepository, Repository } from 'typeorm';
import { User, User_ } from '../../model/entity/user.entity';
import { ChatParticipant_ } from '../../model/entity/chat-participant.entity';
import { Chat_ } from '../../model/entity/chat.entity';
import { ChatMessage_ } from '../../model/entity/chat-message.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async countByEmail(email: string): Promise<number | undefined> {
    return this.count({
      where: [{ email: email }],
    });
  }

  public async getPasswordForEmail(email: string): Promise<string | undefined> {
    const user: User = await this.createQueryBuilder(User_.TN)
      .where(`${User_.TN}.${User_.EMAIL} = :email`, { email })
      .select(`${User_.TN}.${User_.PASSWORD}`)
      .getOne();

    return user?.password;
  }

  public async getIdAndSocketIdForEmail(
    email: string,
  ): Promise<{ userId: number; socketId: string } | undefined> {
    const result = await this.createQueryBuilder(User_.TN)
      .select(`${User_.TN}.${User_.ID}`, `${User_.TN}_${User_.ID}`)
      .addSelect(
        `${User_.TN}.${User_.SOCKET_ID}`,
        `${User_.TN}_${User_.SOCKET_ID}`,
      )
      .where(`${User_.TN}.${User_.EMAIL} = :email`, { email })
      .getRawOne();

    return {
      userId: result[`${User_.TN}_${User_.ID}`],
      socketId: result[`${User_.TN}_${User_.SOCKET_ID}`],
    };
  }

  public async getUsersPrioritizeMessageCount({
    userId,
    takeCount,
  }: {
    userId: number;
    takeCount: number;
  }): Promise<User[]> {
    const ALIAS_MESSAGE_COUNT = 'chat_message_count';

    return await this.createQueryBuilder(User_.TN)
      .leftJoin(
        `${User_.TN}.${User_.RL_CHAT_PARTICIPANTS}`,
        ChatParticipant_.TN,
      )
      .leftJoin(`${ChatParticipant_.TN}.${ChatParticipant_.RL_CHAT}`, Chat_.TN)
      .leftJoin(`${Chat_.TN}.${Chat_.RL_CHAT_MESSAGES}`, ChatMessage_.TN)
      .select([
        `${User_.TN}.${User_.ID}`,
        `${User_.TN}.${User_.FIRST_NAME}`,
        `${User_.TN}.${User_.LAST_NAME}`,
        `${User_.TN}.${User_.EMAIL}`,
        `${User_.TN}.${User_.CREATED_AT}`,
        `${User_.TN}.${User_.UPDATED_AT}`,
      ])
      .addSelect(
        `COUNT(${ChatMessage_.TN}.${ChatMessage_.ID})`,
        ALIAS_MESSAGE_COUNT,
      )
      .where(`${User_.TN}.${User_.ID} != :userId`, { userId })
      .groupBy(`${User_.TN}.${User_.ID}`)
      .orderBy(ALIAS_MESSAGE_COUNT, 'DESC')
      .take(takeCount)
      .getMany();
  }

  public async findById(userId: number): Promise<User> {
    return this.findOne(userId, {
      select: [User_.ID, User_.FIRST_NAME, User_.LAST_NAME, User_.EMAIL],
    });
  }

  public async searchByKeyword({
    keyword,
    takeCount,
  }: {
    keyword: string;
    takeCount: number;
  }): Promise<User[]> {
    return this.createQueryBuilder(User_.TN)
      .select([
        `${User_.TN}.${User_.ID}`,
        `${User_.TN}.${User_.FIRST_NAME}`,
        `${User_.TN}.${User_.LAST_NAME}`,
        `${User_.TN}.${User_.EMAIL}`,
        `${User_.TN}.${User_.CREATED_AT}`,
      ])
      .where(
        `LOWER(
          CONCAT(
            ${User_.TN}.${User_.FIRST_NAME},
            ${User_.TN}.${User_.LAST_NAME}
          )
        ) LIKE LOWER(:keyword)`,
      )
      .setParameters({ keyword: `%${keyword}%` })
      .take(takeCount)
      .getMany();
  }

  public async getSocketId(userId: number): Promise<string | undefined> {
    const result = await this.createQueryBuilder(User_.TN)
      .select(
        `${User_.TN}.${User_.SOCKET_ID}`,
        `${User_.TN}_${User_.SOCKET_ID}`,
      )
      .where(`${User_.TN}.${User_.ID} = :userId`, { userId })
      .getRawOne();

    return result[`${User_.TN}_${User_.SOCKET_ID}`];
  }
}
