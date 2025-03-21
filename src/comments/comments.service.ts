import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class CommentsService {
  constructor(private readonly prisma: PrismaClient) {}
  async create(createCommentDto: CreateCommentDto) {
    return this.prisma.comment.create({
      data: createCommentDto,
    });
  }

  async findAll(user_id: string) {
    return this.prisma.comment.findMany();
  }

  async findOne(id: string, user_id: string) {
    const comment = await this.prisma.query.findUnique({
      where: { id },
    });

    if (!comment) {
      throw new NotFoundException(`Comment not found`);
    }
    return comment;
  }

  async update(
    id: string,
    updateCommentDto: UpdateCommentDto,
    user_id: string,
  ) {
    await this.findOne(id, user_id);
    return this.prisma.comment.update({
      where: { id },
      data: updateCommentDto,
    });
  }

  async remove(id: string, user_id: string) {
    await this.findOne(id, user_id);

    return this.prisma.comment.delete({
      where: { id },
    });
  }
}
