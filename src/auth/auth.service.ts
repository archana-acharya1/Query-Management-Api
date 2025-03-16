import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaClient } from '@prisma/client';
import { compare } from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto, LoginDto } from './auth.controller';
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    const token = await this.jwtService.signAsync({
      user_id: user.id,
      role: user.role,
    });

    return { token };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findFirst({
      where: {
        email: loginDto.email,
      },
    });

    if (!user) {
      throw new NotFoundException(`User ${loginDto.email} not found`);
    }

    if (!(await compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid Credentials');
    }

    const token = await this.jwtService.signAsync({
      user_id: user.id,
      role: user.role,
    });

    return { token };
  }
}
