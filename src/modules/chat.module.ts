import { Module } from '@nestjs/common';
import { ChatController } from '../controller/chat.controller';
import { AuthenticationGuardModule } from './common/authentication_guard.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatRepository } from '../repositories/chat.repository';
import { ChatService } from '../service/chat.service';

@Module({
  imports: [
    AuthenticationGuardModule,
    TypeOrmModule.forFeature([ChatRepository]),
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
