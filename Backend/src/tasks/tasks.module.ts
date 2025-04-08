import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Task, TaskSchema } from './tasks.schema';
import { Taskrepo } from './task.repository';

@Module({
  imports:[
    MongooseModule.forFeature([{name:Task.name,schema:TaskSchema}])
  ],
  controllers: [TasksController],
  providers: [TasksService,Taskrepo]
})
export class TasksModule {}
