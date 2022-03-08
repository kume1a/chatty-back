import { IsEmail, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

export class SignInRequestDto {
  @IsEmail()
  @MaxLength(255)
  readonly email: string;

  @IsNotEmpty()
  @MinLength(6)
  @MaxLength(255)
  readonly password: string;
}
