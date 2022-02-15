import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import * as bcrypt from 'bcrypt';
import { AuthenticationPayloadDto } from '../model/response/authentication_payload.dto';
import { JwtHelper } from '../helper/jwt.helper';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtHelper: JwtHelper,
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
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await this.userService.createUser({
      firstName,
      lastName,
      email,
      passwordHash,
    });

    const accessToken = this.jwtHelper.generateAccessToken({ userId: user.id });

    return new AuthenticationPayloadDto(accessToken);
  }

  public async userPasswordMatches({
    password,
    email,
  }: {
    password: string;
    email: string;
  }): Promise<boolean> {
    const passwordHash = await this.userService.getPasswordFor(email);

    return bcrypt.compare(password, passwordHash);
  }

  public async signin({
    email,
  }: {
    email: string;
  }): Promise<AuthenticationPayloadDto> {
    const userId = await this.userService.getIdFor(email);
    const accessToken = this.jwtHelper.generateAccessToken({ userId });

    return new AuthenticationPayloadDto(accessToken);
  }
}
