import { Module, Global } from '@nestjs/common';
import { SocketService } from './socket.service';
import { AppGateway } from './app.gateway';
import { AuthenticationGuardModule } from '../common/authentication-guard.module';
import { UserService } from '../user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from '../user/user.repository';
import { UserMapper } from '../../model/mappers/user.mapper';
import { OnlineUsersStore } from '../user/online-users.store';

@Global()
@Module({
  imports: [
    AuthenticationGuardModule,
    TypeOrmModule.forFeature([UserRepository]),
  ],
  providers: [
    SocketService,
    AppGateway,
    UserService,
    UserMapper,
    OnlineUsersStore,
  ],
  exports: [SocketService],
})
export class SocketModule {}
