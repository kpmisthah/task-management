import {IsString,IsNotEmpty} from 'class-validator'
export class AuthPayloadDto{
    @IsString()
    @IsNotEmpty()
    username:string;
    @IsNotEmpty()
    password:string;
}