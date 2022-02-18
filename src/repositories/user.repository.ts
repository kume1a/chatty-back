import { EntityRepository, Repository } from 'typeorm';
import { User, User_ } from '../model/entity/user.entity';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  public async countByEmail(email: string): Promise<number | undefined> {
    const countByEmail: { count: number } | undefined =
      await this.createQueryBuilder(User_.TN)
        .where(`${User_.TN}.${User_.EMAIL} = :email`, { email })
        .select(`COUNT(${User_.TN}.${User_.ID})`)
        .getRawOne();

    return countByEmail?.count;
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
}
