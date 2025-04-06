import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TasksModule } from './tasks/tasks.module';
import { SharedModule } from './shared/shared.module';
import {MongooseModule} from '@nestjs/mongoose'

@Module({
  imports: [AuthModule, TasksModule, SharedModule,MongooseModule.forRoot('mongodb://localhost:27017/taskmanager')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
