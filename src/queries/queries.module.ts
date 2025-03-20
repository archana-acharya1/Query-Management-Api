import { Module } from '@nestjs/common';
import { QueriesService } from './queries.service';
import { QueriesController } from './queries.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [QueriesController],
  providers: [QueriesService, PrismaClient],
})
export class QueriesModule {}
