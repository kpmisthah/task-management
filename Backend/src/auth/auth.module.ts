import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import {JwtModule} from '@nestjs/jwt'
import {PassportModule} from '@nestjs/passport'
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './auth.user.schema';

@Module({
  imports:[
    JwtModule.register({
      secret:'abc123',
      signOptions:{expiresIn:'1d'}
    }),
    PassportModule,
    MongooseModule.forFeature([{name:User.name,schema:UserSchema}])
  ],
  controllers: [AuthController],
  providers: [AuthService,LocalStrategy,JwtStrategy]
})
export class AuthModule {}
