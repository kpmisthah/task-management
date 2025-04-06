import { Prop,Schema,SchemaFactory } from "@nestjs/mongoose";
import { Document,Types } from "mongoose";
import { User } from "src/auth/auth.user.schema";

@Schema()
export class Task extends Document{
    @Prop({required:true})
    title:string
    @Prop({required:true})
    description:string
    @Prop({default:'pending',enum:['pending','completed']})
    status:string
    // @Prop({required:true})
    // userId:number
    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;
}

export const TaskSchema = SchemaFactory.createForClass(Task)