export class UserDto {
  constructor(
    readonly id: number,
    readonly firstName: string,
    readonly lastName: string,
    readonly email: string,
  ) {}
}
