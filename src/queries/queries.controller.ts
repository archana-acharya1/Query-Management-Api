import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { QueriesService } from './queries.service';
import { CreateQueryDto } from './dto/create-query.dto';
import { UpdateQueryDto } from './dto/update-query.dto';
import { Request } from 'express';
import { AuthGuard } from 'src/guards/auth/auth.guard';

export interface QueryRequest extends Request {
  payload: {
    user: {
      id: string;
      name: string;
      email: string;
      role: string;
    };
  };
}

@Controller('queries')
@UseGuards(AuthGuard)
export class QueriesController {
  constructor(private readonly queriesService: QueriesService) {}

  @Post()
  async create(
    @Req() request: QueryRequest,
    @Body() createQueryDto: CreateQueryDto,
  ) {
    return this.queriesService.create(createQueryDto);
  }

  @Get()
  async findAll(@Req() request: QueryRequest) {
    return this.queriesService.findAll(request.payload.user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() request: QueryRequest) {
    return this.queriesService.findOne(id, request.payload.user.id);
  }

  @Patch(':id')
  async update(
    @Req() request: QueryRequest,
    @Param('id') id: string,
    @Body() updateQueryDto: UpdateQueryDto,
  ) {
    return this.queriesService.update(
      id,
      updateQueryDto,
      request.payload.user.id,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() request: QueryRequest) {
    return this.queriesService.remove(id, request.payload.user.id);
  }
}
