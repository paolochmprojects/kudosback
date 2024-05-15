import { Controller, Post } from '@nestjs/common';

@Controller('')
export class AuthController {
  constructor() {}

  @Post('login')
  login() {
    return { message: 'hola' };
  }
}
