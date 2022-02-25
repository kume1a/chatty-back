import {
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserDto } from '../model/response/user.dto';
import { UserService } from '../service/user.service';
import { JwtAccessTokenAuthGuard } from '../security/jwt_access_token.guard';
import { CurrentUserPayloadInterceptor } from '../interceptor/current_user_payload.interceptor';
import { CurrentUserPayload } from '../decorator/current_user_payload.decorator';
import { UserPayload } from '../model/common/user_payload';
import { GenericException } from '../exception/generic.exception';
import { ErrorMessageCodes } from '../exception/error_messages';

@UseGuards(JwtAccessTokenAuthGuard)
@Controller(UserController.PATH)
export class UserController {
  public static readonly PATH = '/users';

  constructor(private readonly userService: UserService) {}

  @UseInterceptors(CurrentUserPayloadInterceptor)
  @Get('/chat-recommended-users')
  public async getChatRecommendedUsers(
    @CurrentUserPayload() currentUserPayload: UserPayload,
    @Query('takeCount', ParseIntPipe) takeCount: number,
  ): Promise<UserDto[]> {
    return this.userService.getChatRecommendedUsers({
      userId: currentUserPayload.userId,
      takeCount: takeCount,
    });
  }

  @Get('/search')
  public async searchUsers(
    @Query('keyword') keyword: string,
    @Query('takeCount', ParseIntPipe) takeCount: number,
  ): Promise<UserDto[]> {
    if (!keyword) {
      throw new GenericException(
        HttpStatus.BAD_REQUEST,
        ErrorMessageCodes.MISSING_KEYWORD,
        'keyword is required',
      );
    }

    return this.userService.search({ keyword, takeCount });
  }

  @UseInterceptors(CurrentUserPayloadInterceptor)
  @Get('/me')
  public async getCurrentUser(
    @CurrentUserPayload() currentUserPayload: UserPayload,
  ): Promise<UserDto> {
    return this.userService.getUser(currentUserPayload.userId);
  }

  @Get('/:userId')
  public async getUser(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UserDto> {
    return this.userService.getUser(userId);
  }
}
