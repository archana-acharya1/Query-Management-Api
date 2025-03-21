import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQueryDto } from './dto/create-query.dto';
import { UpdateQueryDto } from './dto/update-query.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class QueriesService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(createQueryDto: CreateQueryDto) {
    return this.prisma.query.create({
      data: createQueryDto,
    });
  }

  async findAll(user_id: string) {
    return this.prisma.query.findMany();
  }

  async findOne(id: string, user_id: string) {
    const query = await this.prisma.query.findUnique({
      where: { id },
    });

    if (!query) {
      throw new NotFoundException(`Query not found`);
    }
    return query;
  }

  async update(id: string, updateQueryDto: UpdateQueryDto, user_id: string) {
    await this.findOne(id, user_id);
    return this.prisma.query.update({
      where: { id },
      data: updateQueryDto,
    });
  }

  async remove(id: string, user_id: string) {
    await this.findOne(id, user_id);
    return this.prisma.query.delete({
      where: { id },
    });
  }
}
