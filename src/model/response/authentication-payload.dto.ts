export class AuthenticationPayloadDto {
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  readonly accessToken: string;
}
