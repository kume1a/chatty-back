import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { SignInRequestDto } from '../model/request/sign_in_request_dto';
import { SignUpRequestDto } from '../model/request/sign_up_request_dto';
import { AuthenticationService } from '../service/authentication.service';
import { UserService } from '../service/user.service';
import { GenericException } from '../exception/generic.exception';
import { AuthenticationPayloadDto } from '../model/response/authentication_payload.dto';

@Controller(AuthenticationController.PATH)
export class AuthenticationController {
  public static readonly PATH = '/authentication';

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly userService: UserService,
  ) {}

  @Post('/signin')
  async signIn(
    @Body() body: SignInRequestDto,
  ): Promise<AuthenticationPayloadDto> {
    const existsByEmail = await this.userService.existsByEmail(body.email);
    if (!existsByEmail) {
      throw new GenericException(
        HttpStatus.UNAUTHORIZED,
        'EMAIL_OR_PASSWORD_INVALID',
        'provided email or password combination is invalid',
      );
    }

    const passwordMatches =
      await this.authenticationService.userPasswordMatches({
        password: body.password,
        email: body.email,
      });
    if (!passwordMatches) {
      throw new GenericException(
        HttpStatus.UNAUTHORIZED,
        'EMAIL_OR_PASSWORD_INVALID',
        'provided email or password combination is invalid',
      );
    }

    return this.authenticationService.signin({ email: body.email });
  }

  @Post('/signup')
  async signUp(
    @Body() body: SignUpRequestDto,
  ): Promise<AuthenticationPayloadDto> {
    if (await this.userService.existsByEmail(body.email)) {
      throw new GenericException(
        HttpStatus.BAD_REQUEST,
        'EMAIL_ALREADY_EXISTS',
        `user with email ${body.email} already exists`,
      );
    }

    return this.authenticationService.signUp({
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      password: body.password,
    });
  }
}
