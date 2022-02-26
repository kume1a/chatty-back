import { HttpStatus, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from '../controller/app.controller';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule } from './authentication.module';
import { GeneralExceptionFilter } from '../exception/general_exception.filter';
import { UserRepository } from '../repositories/user.repository';
import { UserModule } from './user.module';
import { ChatModule } from './chat.module';
import { MessageModule } from './message.module';
import { SocketModule } from './socket.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([UserRepository]),
    AuthenticationModule,
    UserModule,
    ChatModule,
    MessageModule,
    SocketModule,
  ],
  controllers: [AppController],
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
