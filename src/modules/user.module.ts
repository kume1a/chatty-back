import { Module } from '@nestjs/common';
import { UserController } from '../controller/user.controller';
import { UserService } from '../service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../repositories/user.repository';
import { AuthenticationGuardModule } from './common/authentication_guard.module';
import { UserMapper } from '../model/mappers/user.mapper';

@Module({
  imports: [
    AuthenticationGuardModule,
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [UserController],
  providers: [UserService, UserMapper],
})
export class UserModule {}
