import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class SignUpRequestDto {
  @IsString()
  @MinLength(1)
  @MaxLength(255)
  readonly firstName: string;

  @IsString()
  @MinLength(1)
  @MaxLength(255)
  readonly lastName: string;

  @IsEmail()
  @MaxLength(255)
  readonly email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(255)
  readonly password: string;
}
