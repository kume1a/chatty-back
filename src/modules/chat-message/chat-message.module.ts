import { Module } from '@nestjs/common';
import { AuthenticationGuardModule } from '../common/authentication-guard.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessageRepository } from './chat-message.repository';
import { ChatMessageService } from './chat-message.service';
import { MessageController } from './message.controller';
import { ChatMessageMapper } from '../../model/mappers/chat-message.mapper';
import { SocketModule } from '../socket/socket.module';
import { UserRepository } from '../user/user.repository';
import { ChatParticipantService } from '../chat/chat-participant/chat-participant.service';
import { ChatParticipantRepository } from '../chat/chat-participant/chat-participant.repository';
import { ImageHelper } from '../../helper/image.helper';
import { ImageMetaRepository } from './image-meta/image-meta.repository';

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
