import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/user-login.dto';
import { genSalt, hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  login(loginDto: LoginDto): string {
    console.log(loginDto);
    const testToken = this.jwtService.sign({ name: 'test' });
    return testToken;
  }

  async register(registerDto: LoginDto) {
    const salt = await genSalt(10);
    registerDto.password = await hash(registerDto.password, salt);
    const userExist = await this.findUserByEmail(registerDto.email);

    if (userExist) {
      throw new BadRequestException('User already exist');
    }

    const user = await this.prisma.user.create({
      data: {
        ...registerDto,
      },
    });
    delete user.password;
    return user;
  }

  async findUserByEmail(email: string) {
    const userExist = await this.prisma.user.findUnique({
      where: { email },
    });
    return userExist;
  }
}
