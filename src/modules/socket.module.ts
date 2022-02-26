import { Module, Global } from '@nestjs/common';
import { SocketService } from '../service/socket.service';
import { AppGateway } from '../ws/app.gateway';
import { AuthenticationGuardModule } from './common/authentication_guard.module';
import { UserService } from '../service/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../repositories/user.repository';
import { UserMapper } from '../model/mappers/user.mapper';

@Global()
@Module({
  imports: [
    AuthenticationGuardModule,
    TypeOrmModule.forFeature([UserRepository]),
  ],
  providers: [SocketService, AppGateway, UserService, UserMapper],
  exports: [SocketService],
})
export class SocketModule {}
