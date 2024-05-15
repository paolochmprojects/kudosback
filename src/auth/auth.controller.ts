import { Body, Controller, Post } from '@nestjs/common';
import { LoginDto } from './dto/user-login.dto';

@Controller('')
export class AuthController {
  constructor() {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return loginDto;
  }
}
