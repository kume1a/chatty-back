import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TestController } from '../controller/test.controller';
import { JwtHelper } from '../helper/jwt.helper';

@Module({
  imports: [JwtModule.register({ secret: process.env.JWT_SECRET })],
  controllers: [TestController],
  providers: [JwtHelper],
})
export class TestModule {}
