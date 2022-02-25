import { Module } from '@nestjs/common';
import { ChatController } from '../controller/chat.controller';
import { AuthenticationGuardModule } from './common/authentication_guard.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRepository } from '../repositories/chat.repository';
import { ChatService } from '../service/chat.service';
import { ChatMapper } from '../model/mappers/chat.mapper';
import { ChatParticipantRepository } from '../repositories/chat_participant.repository';
import { ChatParticipantService } from '../service/chat_participant.service';

@Module({
  imports: [
    AuthenticationGuardModule,
    TypeOrmModule.forFeature([ChatRepository, ChatParticipantRepository]),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatMapper, ChatParticipantService],
})
export class ChatModule {}
