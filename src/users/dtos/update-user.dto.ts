import { IsOptional, IsString, IsStrongPassword } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  readonly email: string;

  @IsStrongPassword()
  @IsOptional()
  readonly password: string;
}
