import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { QueriesModule } from './queries/queries.module';

@Module({
  imports: [UsersModule, AuthModule, QueriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
