import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Request } from 'express';

export interface CommentRequest extends Request {
  payload: {
    user_id: string;
  };
}

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  async create(
    @Req() request: CommentRequest,
    @Body() createCommentDto: CreateCommentDto,
  ) {
    createCommentDto.user_id = request.payload.user_id;
    return this.commentsService.create(createCommentDto);
  }

  @Get()
  async findAll(@Req() request: CommentRequest) {
    return this.commentsService.findAll(request.payload.user_id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() request: CommentRequest) {
    return this.commentsService.findOne(id, request.payload.user_id);
  }

  @Patch(':id')
  async update(
    @Req() request: CommentRequest,
    @Param('id') id: string,
    @Body() updateCommentDto: UpdateCommentDto,
  ) {
    return this.commentsService.update(
      id,
      updateCommentDto,
      request.payload.user_id,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request: CommentRequest) {
    return this.commentsService.remove(id, request.payload.user_id);
  }
}
