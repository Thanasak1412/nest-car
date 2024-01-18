import { IsEmail } from 'class-validator';

export class FindUserDto {
  @IsEmail()
  readonly email: string;
}
