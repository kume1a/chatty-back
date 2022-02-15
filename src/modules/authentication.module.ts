import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticationService } from '../service/authentication.service';
import { User } from '../model/entity/user.entity';
import { AuthenticationController } from '../controller/authentication.controller';
import { UserService } from '../service/user.service';
import { JwtHelper } from '../helper/jwt.helper';

@Module({
  imports: [
    JwtModule.register({ secret: process.env.JWT_SECRET }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, UserService, JwtHelper],
  exports: [AuthenticationService],
})
export class AuthenticationModule {}
