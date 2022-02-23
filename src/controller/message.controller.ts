import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ChatMessageDto } from '../model/response/chat_message.dto';
import { ChatMessageService } from '../service/chat_message.service';
import { SendChatMessageRequestDto } from '../model/request/send_message_request.dto';
import { JwtAccessTokenAuthGuard } from '../security/jwt_access_token.guard';
import { PaginatedResponseDto } from '../model/response/core/paginated_response.dto';
import { PaginationQueryRequestDto } from '../model/request/common/pagination_query_request.dto';
import { CurrentUserPayload } from '../decorator/current_user_payload.decorator';
import { UserPayload } from '../model/common/user_payload';
import { CurrentUserPayloadInterceptor } from '../interceptor/current_user_payload.interceptor';

@UseGuards(JwtAccessTokenAuthGuard)
@Controller(MessageController.PATH)
export class MessageController {
  public static readonly PATH = '/messages';

  constructor(private readonly chatMessageService: ChatMessageService) {}

  @UseInterceptors(CurrentUserPayloadInterceptor)
  @Post()
  public async sendChatMessage(
    @Body() body: SendChatMessageRequestDto,
    @CurrentUserPayload() currentUserPayload: UserPayload,
  ): Promise<ChatMessageDto> {
    return this.chatMessageService.sendMessage({
      chatId: body.chatId,
      textMessage: body.textMessage,
      userId: currentUserPayload.userId,
    });
  }

  @Get('/:chatId')
  public async getMessages(
    @Param('chatId', ParseIntPipe) chatId: number,
    @Query() paginationQuery: PaginationQueryRequestDto,
  ): Promise<PaginatedResponseDto<ChatMessageDto>> {
    return this.chatMessageService.getMessages({
      chatId,
      lastId: paginationQuery.lastId,
      takeCount: paginationQuery.takeCount,
    });
  }
}
