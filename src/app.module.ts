import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { QueriesModule } from './queries/queries.module';
import { CommentsModule } from './comments/comments.module';
import { AdminModule } from './guards/admin/admin.module';

@Module({
  imports: [UsersModule, AuthModule, QueriesModule, CommentsModule, AdminModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
