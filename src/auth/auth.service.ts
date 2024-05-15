import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto } from './dto/user-login.dto';
import { compare, genSalt, hash } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async login(loginDto: LoginDto): Promise<{ token: string }> {
    const userExist = await this.findUserByEmail(loginDto.email);

    if (!userExist) throw new BadRequestException('Invalid credentials');

    const isPasswordValid = await compare(
      loginDto.password,
      userExist.password,
    );

    if (!isPasswordValid) throw new BadRequestException('Invalid credentials');

    const token = this.jwtService.sign({ id: userExist.id });

    return { token };
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
