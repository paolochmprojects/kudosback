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

export class RegisterDto extends LoginDto {
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;

  @IsString()
  @MinLength(3)
  name: string;

  @IsNumber()
  @Min(1)
  @Max(120)
  @IsOptional()
  age: number;
}
