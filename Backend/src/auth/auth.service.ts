import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthPayloadDto } from './dto/auth.dto';
import { Authrepo } from './auth.repository';

@Injectable()
export class AuthService {
    constructor(private readonly authrepo:Authrepo,private jwtservice:JwtService){}
    async validateUser({username,password}:AuthPayloadDto):Promise<string|null>{
        let findUser = await this.authrepo.validateUsername(username)
        if(!findUser)return null
        const isPassword = await this.authrepo.validatePassword(password,findUser.password)
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
        const existingUser = await this.authrepo.validateUsername(username)
        if(existingUser) throw new UnauthorizedException('username is already Exist')
        const savedUser = await this.authrepo.singup({username,password})
        const{password:_password,...user} = savedUser.toObject()
        return {access_token:this.jwtservice.sign(user)}
    }
}
