import { IsEmail, IsOptional, IsStrongPassword } from 'class-validator';

export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  readonly email: string;

  @IsStrongPassword()
  @IsOptional()
  readonly password: string;
}
