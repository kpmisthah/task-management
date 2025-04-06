import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto/auth.dto';
import { Model } from 'mongoose';
import { User } from './auth.user.schema';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt'
// import { use } from 'passport';
// let fakeUser = [
//     { id: 1, username: 'admin', password: 'admin', role: 'admin' },
//     { id: 2, username: 'user', password: 'user', role: 'user' },
// ]
@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>,private jwtservice:JwtService){}
    async validateUser({username,password}:AuthPayloadDto):Promise<string|null>{
        let findUser = await this.userModel.findOne({username})
        if(!findUser)return null
        const isPassword = await bcrypt.compare(password,findUser.password)
        if(isPassword){
            //ivide password namml pass cheyyan padilla
            //so password destructure cheyth vaaki ullath user
            //lekk spread vech coph cheyya
            const {password,...user} = findUser.toObject()
            return this.jwtservice.sign(user)
        }
        return null
    }

    async singup({username,password}:AuthPayloadDto):Promise<{access_token:string}>{
        const existingUser = await this.userModel.findOne({username})
        console.log(existingUser,'ufe');
        
        if(existingUser) throw new UnauthorizedException('username is already Exist')
        const hashedPassword = await bcrypt.hash(password,10)
        const newUser = new this.userModel({
            username,
            password:hashedPassword
        })
        const savedUser = await newUser.save()
        const{password:_password,...user} = savedUser.toObject()
        return {access_token:this.jwtservice.sign(user)}
    }
}
