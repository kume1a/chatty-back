import { Injectable } from '@nestjs/common';
import { User } from '../model/entity/user.entity';
import { UserRepository } from '../repositories/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async existsByEmail(email: string): Promise<boolean> {
    const countByEmail = await this.userRepository.countByEmail(email);

    return countByEmail && countByEmail > 0;
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
    return this.userRepository.getPasswordForEmail(email);
  }

  async getIdForEmail(email: string): Promise<number | undefined> {
    return this.userRepository.getIdForEmail(email);
  }
}
