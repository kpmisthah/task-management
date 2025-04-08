import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./auth.user.schema";
import { AuthPayloadDto } from "./dto/auth.dto";
import * as argon from 'argon2'
export class Authrepo{
     constructor(@InjectModel(User.name) private userModel: Model<User>){}
         async validateUsername(username:string):Promise<User|null>{
             return this.userModel.findOne({username})
         }

       async validatePassword(input:string,stored:string){
        return argon.verify(input,stored)
       }
     
         async singup({username,password}:AuthPayloadDto):Promise<User>{
             const hashedPassword = await argon.hash("password")
             const newUser = new this.userModel({
                 username,
                 password:hashedPassword
             })
             return newUser.save()
         }
     }
     
