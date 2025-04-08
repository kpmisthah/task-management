import { InjectModel } from "@nestjs/mongoose";
import { Task } from "./tasks.schema";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { CreateTaskDto } from "./dto/create-task.dto/create-task.dto";

@Injectable()
export class Taskrepo{
    constructor(@InjectModel(Task.name) private taskModel:Model<Task>){}
    async create(task:{title:string,description:string,status:string,userId:string}):Promise<Task>{
        const newTask = new this.taskModel({
            title:task.title,
            description:task.description,
            status:task.status || 'pending',
            userId:task.userId
            
        })
        return newTask.save()
    }
    async findAll(userId:string):Promise<Task[]>{
        return this.taskModel.find({userId})
    }
    async updateTask(id:string,updateData:Partial<CreateTaskDto>):Promise<Task|null>{
        return this.taskModel.findByIdAndUpdate(id,updateData,{new:true})
    }
    async deleteTask(id:string,deleteData:CreateTaskDto){
        return this.taskModel.findByIdAndDelete(id,deleteData)
    }

}