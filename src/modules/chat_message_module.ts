import { Module } from '@nestjs/common';
import { AuthenticationGuardModule } from './common/authentication_guard.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessageRepository } from '../repositories/chat_message.repository';
import { ChatMessageService } from '../service/chat_message.service';
import { MessageController } from '../controller/message.controller';
import { ChatMessageMapper } from '../model/mappers/chat_message.mapper';
import { SocketModule } from './socket.module';
import { UserRepository } from '../repositories/user.repository';
import { ChatParticipantService } from '../service/chat_participant.service';
import { ChatParticipantRepository } from '../repositories/chat_participant.repository';
import { ImageHelper } from '../helper/image.helper';
import { ImageMetaRepository } from '../repositories/image_meta.repository';

@Module({
  imports: [
    AuthenticationGuardModule,
    TypeOrmModule.forFeature([
      ChatMessageRepository,
      UserRepository,
      ChatParticipantRepository,
      ImageMetaRepository,
    ]),
    SocketModule,
  ],

  providers: [
    ChatMessageService,
    ChatMessageMapper,
    ChatParticipantService,
    ImageHelper,
  ],
  controllers: [MessageController],
})
export class ChatMessageModule {}
