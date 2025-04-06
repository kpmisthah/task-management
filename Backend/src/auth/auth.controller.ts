import { Body, Controller, Post, UseGuards,Get, Req } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { LocalGuard } from 'src/guard/local.guard';
import { JwtGuard } from 'src/guard/jwt.guard';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService:AuthService){}
    @Post('login')
    // @UseGuards(AuthGuard('local')) //this authguard prvided by nest js passport we only need to invoke it and set the strategy
    //we can pass it like this but nest not support pass it as a string we want to create separate module for that
    @UseGuards(LocalGuard)
    login(@Req() req:Request){
        return {access_token:req.user}
    }
    @Post('signup')
    singup(@Body() authPayload:AuthPayloadDto){
        return this.authService.singup(authPayload)
    }
    //we implement jwt.strategy.ts for this get method..so we want to implement guard
    @Get('status')
    @UseGuards(JwtGuard)
    status(@Req() req:Request){
        console.log("Inside get status");
        console.log(req.user )   
        return req.user
    }
}
