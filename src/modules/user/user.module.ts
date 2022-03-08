import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthenticationGuardModule } from '../common/authentication-guard.module';
import { UserMapper } from '../../model/mappers/user.mapper';

@Module({
  imports: [
    AuthenticationGuardModule,
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [UserController],
  providers: [UserService, UserMapper],
})
export class UserModule {}
