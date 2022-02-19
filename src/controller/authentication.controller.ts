import { Body, Controller, Post } from '@nestjs/common';
import { SignInRequestDto } from '../model/request/sign_in_request.dto';
import { SignUpRequestDto } from '../model/request/sign_up_request.dto';
import { AuthenticationService } from '../service/authentication.service';
import { AuthenticationPayloadDto } from '../model/response/authentication_payload.dto';

@Controller(AuthenticationController.PATH)
export class AuthenticationController {
  public static readonly PATH = '/authentication';

  constructor(private readonly authenticationService: AuthenticationService) {}

  @Post('/signin')
  async signIn(
    @Body() body: SignInRequestDto,
  ): Promise<AuthenticationPayloadDto> {
    return this.authenticationService.signin({
      email: body.email,
      password: body.password,
    });
  }

  @Post('/signup')
  async signUp(
    @Body() body: SignUpRequestDto,
  ): Promise<AuthenticationPayloadDto> {
    return this.authenticationService.signUp({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
    });
  }
}
