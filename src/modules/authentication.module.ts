import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from '../service/authentication.service';
import { AuthenticationController } from '../controller/authentication.controller';
import { UserService } from '../service/user.service';
import { JwtHelper } from '../helper/jwt.helper';
import { PasswordEncoder } from '../helper/password_encoder';
import { UserRepository } from '../repositories/user.repository';
import { JwtTokenExtractor } from '../helper/jwt_token.extractor';
import { UserMapper } from '../model/mappers/user.mapper';

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
