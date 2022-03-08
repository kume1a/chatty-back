import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { AuthenticationPayloadDto } from '../../model/response/authentication-payload.dto';
import { JwtHelper } from '../../helper/jwt.helper';
import { PasswordEncoder } from '../../helper/password.encoder';
import { GenericException } from '../../exception/generic.exception';
import { ErrorMessageCode } from '../../exception/error-message-code';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtHelper: JwtHelper,
    private readonly passwordEncoder: PasswordEncoder,
  ) {}

  public async signUp({
    firstName,
    lastName,
    email,
    password,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }): Promise<AuthenticationPayloadDto> {
    if (await this.userService.existsByEmail(email)) {
      throw new GenericException(
        HttpStatus.BAD_REQUEST,
        ErrorMessageCode.EMAIL_ALREADY_EXISTS,
        `user with email ${email} already exists`,
      );
    }

    const passwordHash = await this.passwordEncoder.encode(password);

    const user = await this.userService.createUser({
      firstName,
      lastName,
      email,
      passwordHash,
    });

    const accessToken = this.jwtHelper.generateAccessToken({
      userId: user.id,
      socketId: user.socketId,
    });

    return new AuthenticationPayloadDto(accessToken);
  }

  public async signin({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<AuthenticationPayloadDto> {
    const existsByEmail = await this.userService.existsByEmail(email);
    if (!existsByEmail) {
      throw new GenericException(
        HttpStatus.UNAUTHORIZED,
        ErrorMessageCode.EMAIL_OR_PASSWORD_INVALID,
        'provided email or password combination is invalid',
      );
    }

    const passwordHash = await this.userService.getPasswordFor(email);
    const passwordMatches = await this.passwordEncoder.matches(
      password,
      passwordHash,
    );
    if (!passwordMatches) {
      throw new GenericException(
        HttpStatus.UNAUTHORIZED,
        ErrorMessageCode.EMAIL_OR_PASSWORD_INVALID,
        'provided email or password combination is invalid',
      );
    }

    const userPayload = await this.userService.getIdAndSocketIdForEmail(email);
    const accessToken = this.jwtHelper.generateAccessToken({
      userId: userPayload.userId,
      socketId: userPayload.socketId,
    });

    return new AuthenticationPayloadDto(accessToken);
  }
}
