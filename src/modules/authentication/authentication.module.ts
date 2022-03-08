import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from './authentication.service';
import { AuthenticationController } from './authentication.controller';
import { UserService } from '../user/user.service';
import { JwtHelper } from '../../helper/jwt.helper';
import { PasswordEncoder } from '../../helper/password.encoder';
import { UserRepository } from '../user/user.repository';
import { JwtTokenExtractor } from '../../helper/jwt-token.extractor';
import { UserMapper } from '../../model/mappers/user.mapper';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    TypeOrmModule.forFeature([UserRepository]),
  ],
  controllers: [AuthenticationController],
  providers: [
    AuthenticationService,
    UserService,
    JwtHelper,
    PasswordEncoder,
    JwtTokenExtractor,
    UserMapper,
  ],
})
export class AuthenticationModule {}
