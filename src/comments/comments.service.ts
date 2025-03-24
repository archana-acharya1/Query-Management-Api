import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaClient) {}

  async create(createCommentDto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: createCommentDto,
    });
  }

  async findAll(search?: string, skip?: number, take?: number) {
    const where: Prisma.CommentWhereInput = {
      ...(search && {
        OR: [
          { content: { contains: search, mode: Prisma.QueryMode.insensitive } },
        ],
      }),
    };

    const [comments, totalCount] = await Promise.all([
      this.prisma.comment.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      this.prisma.comment.count({ where }),
    ]);

    return { totalCount, comments };
  }

  async findOne(id: string) {
    return this.getComment(id);
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    await this.getComment(id);
    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
    });
  }

  async remove(id: string) {
    await this.getComment(id);
    return this.prisma.comment.delete({
      where: { id },
    });
  }

  private async getComment(id: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id } });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }
    return comment;
  }
}
