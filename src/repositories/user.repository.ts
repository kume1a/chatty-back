import { EntityRepository, Repository } from 'typeorm';
import { User, User_ } from '../model/entity/user.entity';
import { ChatParticipant_ } from '../model/entity/chat_participant.entity';
import { Chat_ } from '../model/entity/chat.entity';
import { ChatMessage_ } from '../model/entity/chat_message.entity';

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

  public async getIdForEmail(email: string): Promise<number | undefined> {
    const user = await this.createQueryBuilder(User_.TN)
      .where(`${User_.TN}.${User_.EMAIL} = :email`, { email })
      .select(`${User_.TN}.${User_.ID}`)
      .getOne();

    return user?.id;
  }

  public async getUsersPrioritizeMessageCount({
    userId,
    takeCount,
  }: {
    userId: number;
    takeCount: number;
  }): Promise<User[]> {
    return await this.createQueryBuilder(User_.TN)
      .select([
        `${User_.TN}.${User_.ID}`,
        `${User_.TN}.${User_.FIRST_NAME}`,
        `${User_.TN}.${User_.LAST_NAME}`,
        `${User_.TN}.${User_.EMAIL}`,
        `${User_.TN}.${User_.CREATED_AT}`,
        `${User_.TN}.${User_.UPDATED_AT}`,
      ])
      .leftJoin(
        `${User_.TN}.${User_.RL_CHAT_PARTICIPANTS}`,
        ChatParticipant_.TN,
      )
      .leftJoin(`${ChatParticipant_.TN}.${ChatParticipant_.RL_CHAT}`, Chat_.TN)
      .leftJoin(`${Chat_.TN}.${Chat_.RL_CHAT_MESSAGES}`, ChatMessage_.TN)
      .where(`${User_.TN}.${User_.ID} != :userId`, { userId })
      .groupBy(`${User_.TN}.${User_.ID}`)
      .orderBy(`COUNT(${ChatMessage_.TN}.${ChatMessage_.ID})`, 'DESC')
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
}
