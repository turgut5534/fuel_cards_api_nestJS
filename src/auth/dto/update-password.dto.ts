import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class UpdatePasswordDto {

  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  confirmPassword: string;
}
