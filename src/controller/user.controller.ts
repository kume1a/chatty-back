import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserDto } from '../model/response/user.dto';
import { UserService } from '../service/user.service';
import { JwtAccessTokenAuthGuard } from '../security/jwt_access_token.guard';
import { CurrentUserPayloadInterceptor } from '../interceptor/current_user_payload.interceptor';
import { CurrentUserPayload } from '../decorator/current_user_payload.decorator';
import { UserPayload } from '../model/common/user_payload';

@UseGuards(JwtAccessTokenAuthGuard)
@Controller(UserController.PATH)
export class UserController {
  public static readonly PATH = '/users';

  constructor(private readonly userService: UserService) {}

  @UseInterceptors(CurrentUserPayloadInterceptor)
  @Get('/chat-recommended-users')
  public getChatRecommendedUsers(
    @CurrentUserPayload() currentUserPayload: UserPayload,
  ): Promise<UserDto[]> {
    return this.userService.getChatRecommendedUsers(currentUserPayload.userId);
  }
}
