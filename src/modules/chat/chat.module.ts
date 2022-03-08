import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { AuthenticationGuardModule } from '../common/authentication-guard.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRepository } from './chat.repository';
import { ChatService } from './chat.service';
import { ChatMapper } from '../../model/mappers/chat.mapper';
import { ChatParticipantRepository } from './chat-participant/chat-participant.repository';
import { ChatParticipantService } from './chat-participant/chat-participant.service';

@Module({
  imports: [
    AuthenticationGuardModule,
    TypeOrmModule.forFeature([ChatRepository, ChatParticipantRepository]),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatMapper, ChatParticipantService],
})
export class ChatModule {}
