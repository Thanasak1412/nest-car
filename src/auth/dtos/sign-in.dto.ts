import { IsEmail, IsStrongPassword } from 'class-validator';

export class SignInDto {
  @IsEmail()
  readonly email: string;

  @IsStrongPassword()
  readonly password: string;
}
