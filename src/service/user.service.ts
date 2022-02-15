import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, User_ } from '../model/entity/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async existsByEmail(email: string): Promise<boolean> {
    const countByEmail: { count: number } | undefined =
      await this.userRepository
        .createQueryBuilder(User_.TABLE_NAME)
        .where(`${User_.TABLE_NAME}.${User_.EMAIL} = :email`, { email })
        .select(`COUNT(${User_.TABLE_NAME}.${User_.ID})`)
        .getRawOne();

    return countByEmail != null && countByEmail.count > 0;
  }

  public async createUser({
    firstName,
    lastName,
    email,
    passwordHash,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
  }): Promise<User> {
    const user = await this.userRepository.create({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    return this.userRepository.save(user);
  }

  public async getPasswordFor(email: string): Promise<string | undefined> {
    const result = await this.userRepository
      .createQueryBuilder(User_.TABLE_NAME)
      .where(`${User_.TABLE_NAME}.${User_.EMAIL} = :email`, { email })
      .select(`${User_.TABLE_NAME}.${User_.PASSWORD}`)
      .getOne();

    return result?.password;
  }

  async getIdFor(email: string): Promise<number | undefined> {
    const result = await this.userRepository
      .createQueryBuilder(User_.TABLE_NAME)
      .where(`${User_.TABLE_NAME}.${User_.EMAIL} = :email`, { email })
      .select(`${User_.TABLE_NAME}.${User_.ID}`)
      .getOne();

    return result?.id;
  }
}
