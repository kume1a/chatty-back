import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { JwtHttpAccessGuard } from '../../security/jwt-http-access.guard';
import { ChatDto } from '../../model/response/chat.dto';
import { ChatService } from './chat.service';
import { CurrentUserPayload } from '../../decorator/current-user-payload.decorator';
import { UserPayload } from '../../model/common/user.payload';
import { CurrentUserPayloadInterceptor } from '../../interceptor/current-user-payload.interceptor';
import { PaginatedResponseDto } from '../../model/response/core/paginated-response.dto';
import { PagePaginationRequestDto } from '../../model/request/common/page-pagination-request.dto';

@UseGuards(JwtHttpAccessGuard)
@Controller(ChatController.PATH)
export class ChatController {
  public static readonly PATH = '/chats';

  constructor(private readonly chatService: ChatService) {}

  @UseInterceptors(CurrentUserPayloadInterceptor)
  @Get()
  public getChats(
    @CurrentUserPayload() currentUserPayload: UserPayload,
    @Query() paginationQuery: PagePaginationRequestDto,
  ): Promise<PaginatedResponseDto<ChatDto>> {
    return this.chatService.getChats({
      userId: currentUserPayload.userId,
      page: paginationQuery.page,
      pageSize: paginationQuery.pageSize,
    });
  }

  @UseInterceptors(CurrentUserPayloadInterceptor)
  @Get('/:userId')
  public async getChatByUserId(
    @Param('userId', ParseIntPipe) userId: number,
    @CurrentUserPayload() currentUserPayload: UserPayload,
  ): Promise<ChatDto> {
    const chat = await this.chatService.getChatByUserId(userId);

    if (!chat) {
      return this.chatService.createChat({
        participant1Id: currentUserPayload.userId,
        participant2Id: userId,
      });
    }

    return chat;
  }
}
