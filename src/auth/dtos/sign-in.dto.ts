import { IsString, IsStrongPassword } from 'class-validator';

export class SignInDto {
  @IsString()
  readonly email: string;

  @IsStrongPassword()
  readonly password: string;
}
