import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already taken');
    }
    createUserDto.password = await hash(createUserDto.password, 10);
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return this.getUser(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    await this.getUser(id);
    return this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        email: updateUserDto.email,
        password: await hash(updateUserDto.password, 10),
        role: updateUserDto.role,
      },
    });
  }

  async remove(id: string) {
    await this.getUser(id);
    return this.prisma.user.delete({
      where: { id },
    });
  }

  private async getUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException('User not Found');
    }
    return user;
  }
}
