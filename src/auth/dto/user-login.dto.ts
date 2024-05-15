import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, Length } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'b6QpA@example.com', description: 'User email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '12345678', description: 'User password' })
  @IsString({ message: 'Password must be a string' })
  @Length(8, 32, { message: 'Password must be between 8 and 32 characters' })
  password: string;
}
