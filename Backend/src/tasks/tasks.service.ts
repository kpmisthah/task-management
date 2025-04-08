import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto';
import { Taskrepo } from './task.repository';
import { Task } from './tasks.schema';
@Injectable()
export class TasksService {
    constructor(private readonly taskRepo:Taskrepo) {}
    async create(task:{title:string,description:string,status:string,userId:string}):Promise<Task>{
        return this.taskRepo.create(task)
    }

    async findAll(userId:string):Promise<Task[]>{
        return this.taskRepo.findAll(userId)
    }
    async updateTask(id:string,updateData:Partial<CreateTaskDto>):Promise<Task>{
        const modifyTask = await this.taskRepo.updateTask(id,updateData)
        if(!modifyTask){
            throw new BadRequestException("Not updated")
        }
        return modifyTask
    }

    async deleteTask(id:string,deleteData:CreateTaskDto){
        const removeTask = await this.taskRepo.deleteTask(id,deleteData)
        if(!removeTask) throw new BadRequestException("Task is not found")
            return removeTask
    }
}
