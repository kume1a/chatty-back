import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ChatMessageDto } from '../model/response/chat_message.dto';
import { ChatMessageService } from '../service/chat_message.service';
import { JwtAccessTokenAuthGuard } from '../security/jwt_access_token.guard';
import { PaginatedResponseDto } from '../model/response/core/paginated_response.dto';
import { PaginationQueryRequestDto } from '../model/request/common/pagination_query_request.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { multerConfig } from '../common/config/multer.config';
import { CurrentUserPayload } from '../decorator/current_user_payload.decorator';
import { UserPayload } from '../model/common/user_payload';
import { CurrentUserPayloadInterceptor } from '../interceptor/current_user_payload.interceptor';
import { SendChatMessageRequestDto } from '../model/request/send_message_request.dto';
import { GenericException } from '../exception/generic.exception';
import { ErrorMessageCodes } from '../exception/error_messages';

@UseGuards(JwtAccessTokenAuthGuard)
@Controller(MessageController.PATH)
export class MessageController {
  public static readonly PATH = '/messages';

  constructor(private readonly chatMessageService: ChatMessageService) {}

  @UseInterceptors(
    CurrentUserPayloadInterceptor,
    FileFieldsInterceptor(
      [
        { name: 'imageFile', maxCount: 1 },
        { name: 'voiceFile', maxCount: 1 },
        { name: 'videoFile', maxCount: 1 },
      ],
      multerConfig,
    ),
  )
  @Post()
  public async sendChatMessage(
    @Req() req: any,
    @Body() body: SendChatMessageRequestDto,
    @CurrentUserPayload() currentUserPayload: UserPayload,
    @UploadedFiles()
    files: {
      imageFile?: Express.Multer.File[];
      voiceFile?: Express.Multer.File[];
      videoFile?: Express.Multer.File[];
    },
  ): Promise<ChatMessageDto> {
    if (
      files.imageFile &&
      !files.imageFile[0].originalname.match(/\.((jpeg)|(jpg))$/)
    ) {
      throw new GenericException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorMessageCodes.UNSUPPORTED_FILE_TYPE,
        'image file should be only type of jpg or jpeg',
      );
    }

    if (files.voiceFile && !files.voiceFile[0].originalname.match(/\.aac$/)) {
      throw new GenericException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorMessageCodes.UNSUPPORTED_FILE_TYPE,
        'voice file should be only type of aac',
      );
    }

    if (files.videoFile && !files.videoFile[0].originalname.match(/\.mp4$/)) {
      throw new GenericException(
        HttpStatus.UNPROCESSABLE_ENTITY,
        ErrorMessageCodes.UNSUPPORTED_FILE_TYPE,
        'video file should be only type of mp4',
      );
    }

    return this.chatMessageService.sendMessage({
      chatId: body.chatId,
      textMessage: body.textMessage,
      userId: currentUserPayload.userId,
      imageFilePath: files.imageFile ? files.imageFile[0].path : undefined,
      voiceFilePath: files.voiceFile ? files.voiceFile[0].path : undefined,
      videoFilePath: files.videoFile ? files.videoFile[0].path : undefined,
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
