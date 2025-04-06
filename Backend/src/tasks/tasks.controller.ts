import { Body, Controller, Req,Post, Get, Put,UseGuards, Param, Delete, UnauthorizedException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto';
import { Request } from 'express';
import { JwtGuard } from 'src/guard/jwt.guard';

@Controller('tasks')
export class TasksController {
    constructor(private taskService:TasksService){}
    @Post('add')
    @UseGuards(JwtGuard)
    add(@Body() createTaskDto:CreateTaskDto, @Req() req:Request){
        console.log("req,user",req.user);
        if (!req.user || !req.user['_id']) {
            throw new UnauthorizedException('User not authenticated');
          }
        return this.taskService.create({...createTaskDto,userId:req.user['_id']})
    }
    @Get()
    @UseGuards(JwtGuard) // Add JwtGuard to protect this endpoint
    findAll(@Req() req: Request) {
      if (!req.user || !req.user['_id']) {
        throw new UnauthorizedException('User not authenticated');
      }
      return this.taskService.findAll(req.user['_id']); // Pass userId to service
    }
    @Put('/update/:id')
    updateTask(@Param('id')id:string,@Body() updateData:Partial<CreateTaskDto>){
        return this.taskService.updateTask(id,updateData)
       
    }

    @Delete('/delete/:id')
    deleteTask(@Param('id') id:string,@Body() deleteData:CreateTaskDto){
        return this.taskService.deleteTask(id,deleteData)
    }
}
