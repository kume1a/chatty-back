import { SimpleMapper } from '../../common/simple_mapper';
import { User } from '../entity/user.entity';
import { UserDto } from '../response/user.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserMapper extends SimpleMapper<User, UserDto> {
  public mapToRight(l: User): Promise<UserDto> | UserDto {
    return new UserDto(l.id, l.firstName, l.lastName, l.email);
  }
}
