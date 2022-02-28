import { User } from '../entity/user.entity';
import { UserDto } from '../response/user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserMapper {
  public mapToRight(user: User): Promise<UserDto> | UserDto {
    return new UserDto(user.id, user.firstName, user.lastName, user.email);
  }
}
