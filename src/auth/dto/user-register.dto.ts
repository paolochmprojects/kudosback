import {
  IsNumber,
  IsOptional,
  IsString,
  IsStrongPassword,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import { LoginDto } from './user-login.dto';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto extends LoginDto {
  @ApiProperty({ example: 'SuperScret@123', description: 'User password' })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @ApiProperty({ example: 'John', description: 'User name' })
  @IsString()
  @MinLength(3)
  name: string;

  @ApiProperty({ example: 27, description: 'User age' })
  @IsNumber()
  @Min(1)
  @Max(120)
  @IsOptional()
  age: number;
}
