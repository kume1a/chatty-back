import {
  Controller,
  Get,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtAccessTokenAuthGuard } from '../security/jwt_access_token.guard';
import { ChatDto } from '../model/response/chat.dto';
import { ChatService } from '../service/chat.service';
import { CurrentUserPayload } from '../decorator/current_user_payload.decorator';
import { UserPayload } from '../model/common/user_payload';
import { CurrentUserPayloadInterceptor } from '../interceptor/current_user_payload.interceptor';
import { PaginationQueryRequestDto } from '../model/request/common/pagination_query_request.dto';
import { PaginatedResponseDto } from '../model/response/core/paginated_response.dto';

@UseGuards(JwtAccessTokenAuthGuard)
@Controller(ChatController.PATH)
export class ChatController {
  public static readonly PATH = '/chats';

  constructor(private readonly chatService: ChatService) {}

  @UseInterceptors(CurrentUserPayloadInterceptor)
  @Get()
  public getChats(
    @CurrentUserPayload() currentUserPayload: UserPayload,
    @Query() paginationQuery: PaginationQueryRequestDto,
  ): Promise<PaginatedResponseDto<ChatDto>> {
    return this.chatService.getChats({
      userId: currentUserPayload.userId,
      lastId: paginationQuery.lastId,
      takeCount: paginationQuery.takeCount,
    });
  }
}
