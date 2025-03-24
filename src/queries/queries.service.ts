import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateQueryDto } from './dto/create-query.dto';
import { UpdateQueryDto } from './dto/update-query.dto';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class QueriesService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(createQueryDto: CreateQueryDto) {
    return this.prisma.query.create({
      data: createQueryDto,
    });
  }

  async findAll(search?: string, skip?: number, take?: number) {
    const where: Prisma.QueryWhereInput = {
      ...(search && {
        OR: [
          { title: { contains: search, mode: Prisma.QueryMode.insensitive } },
          {
            description: {
              contains: search,
              mode: Prisma.QueryMode.insensitive,
            },
          },
        ],
      }),
    };

    const [queries, totalCount] = await Promise.all([
      this.prisma.query.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.query.count({ where }),
    ]);

    return { totalCount, queries };
  }

  async findOne(id: string) {
    return this.getQuery(id);
  }

  async update(id: string, updateQueryDto: UpdateQueryDto) {
    await this.getQuery(id);
    return this.prisma.query.update({
      where: { id },
      data: updateQueryDto,
    });
  }

  async remove(id: string) {
    await this.getQuery(id);
    return this.prisma.query.delete({
      where: { id },
    });
  }

  private async getQuery(id: string) {
    const query = await this.prisma.query.findUnique({ where: { id } });

    if (!query) {
      throw new NotFoundException('Query not found');
    }
    return query;
  }
}
