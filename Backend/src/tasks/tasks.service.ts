import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './tasks.schema';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto/create-task.dto';
@Injectable()
export class TasksService {
    constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}
    async create(task:{title:string,description:string,status:string,userId:string}):Promise<Task>{
        const newTask = new this.taskModel({
            title:task.title,
            description:task.description,
            status:task.status || 'pending',
            userId:task.userId
            
        })
        console.log(task.userId)
        return newTask.save()
    }

    async findAll(userId:string):Promise<Task[]>{
        return this.taskModel.find({userId})
    }
    async updateTask(id:string,updateData:Partial<CreateTaskDto>):Promise<Task>{
        const modifyTask = await this.taskModel.findByIdAndUpdate(id,updateData,{new:true})
        if(!modifyTask){
            throw new BadRequestException("Not updated")
        }
        return modifyTask
    }

    async deleteTask(id:string,deleteData:CreateTaskDto){
        const removeTask = await this.taskModel.findByIdAndDelete(id,deleteData)
        if(!removeTask) throw new BadRequestException("Task is not found")
            return removeTask
    }
}
