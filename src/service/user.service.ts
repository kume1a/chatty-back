import { HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../model/entity/user.entity';
import { UserRepository } from '../repositories/user.repository';
import { UserDto } from '../model/response/user.dto';
import { UserMapper } from '../model/mappers/user.mapper';
import { GenericException } from '../exception/generic.exception';
import { ErrorMessageCode } from '../exception/error_messages';
import { v4 } from 'uuid';

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

  public async createUser(params: {
    firstName: string;
    lastName: string;
    email: string;
    passwordHash: string;
  }): Promise<User> {
    const user = await this.userRepository.create({
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email,
      password: params.passwordHash,
      socketId: v4(),
    });

    return this.userRepository.save(user);
  }

  public async getPasswordFor(email: string): Promise<string | undefined> {
    return this.userRepository.getPasswordForEmail(email);
  }

  public async getIdAndSocketIdForEmail(
    email: string,
  ): Promise<{ userId: number; socketId: string } | undefined> {
    return this.userRepository.getIdAndSocketIdForEmail(email);
  }

  public async getChatRecommendedUsers({
    userId,
    takeCount,
  }: {
    userId: number;
    takeCount: number;
  }): Promise<UserDto[]> {
    const users = await this.userRepository.getUsersPrioritizeMessageCount({
      userId,
      takeCount,
    });

    return Promise.all(users.map(this.userMapper.mapToRight));
  }

  public async getUser(userId: number): Promise<UserDto> {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new GenericException(
        HttpStatus.NOT_FOUND,
        ErrorMessageCode.USER_NOT_FOUND,
        `user with provided id ${userId} could not be found`,
      );
    }

    return this.userMapper.mapToRight(user);
  }

  public async search({
    keyword,
    takeCount,
  }: {
    keyword: string;
    takeCount: number;
  }): Promise<UserDto[]> {
    const users = await this.userRepository.searchByKeyword({
      keyword,
      takeCount,
    });

    return Promise.all(users.map(this.userMapper.mapToRight));
  }

  public async getSocketId(userId: number): Promise<string> {
    return this.userRepository.getSocketId(userId);
  }
}
