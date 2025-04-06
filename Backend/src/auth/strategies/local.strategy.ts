import { PassportStrategy } from "@nestjs/passport";
import{Strategy} from 'passport-local'
import { AuthService } from "../auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";
@Injectable() //we want to use local strategy as provider so thats why we use injectable decorator
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private authService:AuthService){
        super();
    }
    validate(username:string,password:string){
        const user = this.authService.validateUser({username,password}) //we pass this as a obj bcz u know that validateUser take it as an object
        if(!user) throw new UnauthorizedException("User is not exist")
            return user
    }
}