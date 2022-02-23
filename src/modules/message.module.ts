import { Module } from '@nestjs/common';
import { AuthenticationGuardModule } from './common/authentication_guard.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatMessageRepository } from '../repositories/chat_message.repository';
import { ChatMessageService } from '../service/chat_message.service';
import { MessageController } from '../controller/message.controller';
import { ChatMessageMapper } from '../model/mappers/chat_message.mapper';

@Module({
  imports: [
    AuthenticationGuardModule,
    TypeOrmModule.forFeature([ChatMessageRepository]),
  ],
  providers: [ChatMessageService, ChatMessageMapper],
  controllers: [MessageController],
})
export class MessageModule {}
