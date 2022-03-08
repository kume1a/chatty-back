import {
  CacheModule,
  HttpStatus,
  Module,
  ValidationPipe,
} from '@nestjs/common';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from './authentication/authentication.module';
import { GeneralExceptionFilter } from '../exception/general-exception.filter';
import { UserRepository } from './user/user.repository';
import { UserModule } from './user/user.module';
import redisStore from 'cache-manager-redis-store';
import { ChatModule } from './chat/chat.module';
import { ChatMessageModule } from './chat-message/chat-message.module';
import { SocketModule } from './socket/socket.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'upload'),
    }),
    TypeOrmModule.forFeature([UserRepository]),
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      isGlobal: true,
      socket: {
        host: 'localhost',
        port: 6379,
      },
    }),
    AuthenticationModule,
    UserModule,
    ChatModule,
    ChatMessageModule,
    SocketModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      }),
    },
    {
      provide: APP_FILTER,
      useClass: GeneralExceptionFilter,
    },
  ],
})
export class AppModule {}
