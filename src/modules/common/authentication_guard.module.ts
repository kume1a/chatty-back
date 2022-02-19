import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { environment } from '../../environment';
import { JwtHelper } from '../../helper/jwt.helper';
import { JwtTokenExtractor } from '../../helper/jwt_token.extractor';

@Module({
  imports: [JwtModule.register({ secret: environment.accessTokenSecret })],
  providers: [JwtHelper, JwtTokenExtractor],
  exports: [JwtHelper, JwtTokenExtractor],
})
export class AuthenticationGuardModule {}
