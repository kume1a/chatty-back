import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../model/entity/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { UserDto } from '../model/response/user.dto';
import { UserMapper } from '../model/mappers/user.mapper';
import { GenericException } from '../exception/generic.exception';
import { ErrorMessageCodes } from '../exception/error_messages';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly userMapper: UserMapper,
  ) {}

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

  public async getIdForEmail(email: string): Promise<number | undefined> {
    return this.userRepository.getIdForEmail(email);
  }

  public async getChatRecommendedUsers(userId: number): Promise<UserDto[]> {
    const users = await this.userRepository.getUsersPrioritizeMessageCount(
      userId,
    );

    return Promise.all(users.map(this.userMapper.mapToRight));
  }

  public async getUser(userId: number): Promise<UserDto> {
    console.log(await this.userRepository.countByEmail('email@gmail.com'));
    const user = await this.userRepository.findById(userId);
    console.log(user);
    if (!user) {
      throw new GenericException(
        HttpStatus.NOT_FOUND,
        ErrorMessageCodes.USER_NOT_FOUND,
        `user with provided id ${userId} could not be found`,
      );
    }

    return this.userMapper.mapToRight(user);
  }
}
