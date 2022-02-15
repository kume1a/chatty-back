import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAccessTokenAuthGuard } from '../security/jwt_access_token.guard';

@UseGuards(JwtAccessTokenAuthGuard)
@Controller(TestController.PATH)
export class TestController {
  public static readonly PATH = 'test';

  @Get()
  async test(): Promise<string> {
    return 'test';
  }
}
