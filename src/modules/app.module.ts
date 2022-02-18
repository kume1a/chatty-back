import { HttpStatus, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from '../controller/app.controller';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from '../service/user.service';
import { AuthenticationModule } from './authentication.module';
import { GeneralExceptionFilter } from '../exception/general_exception.filter';
import { TestModule } from './test.module';
import { UserRepository } from '../repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forRoot(),
    TypeOrmModule.forFeature([UserRepository]),
    AuthenticationModule,
    TestModule,
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
    UserService,
  ],
})
export class AppModule {}
