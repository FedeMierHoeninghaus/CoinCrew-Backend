import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { UnauthorizedException } from "@nestjs/common";
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(private configService: ConfigService){
      super({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        ignoreExpiration: false,
        secretOrKey: configService.get('JWT_SECRET'),
    });
  }
  validate(payload: any){
    if(!payload.sub){
        throw new UnauthorizedException('Token inválido');
    }
    return {
         userId: payload.sub,
         email: payload.email 
        };
  }
}
