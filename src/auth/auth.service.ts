import { Injectable } from '@nestjs/common';
import { loginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService,
     private readonly jwtService: JwtService){}

  async register(registerDto: RegisterDto){
    const user = await this.userService.createUser(
      registerDto.nombre,
      registerDto.apellido,
      registerDto.email,
      registerDto.password
    );
    
    const payload = {sub: user.id, email: user.email};
    const access_token = await this.jwtService.signAsync(payload);
    
    return {
      access_token,
      user: user,
    };
  }

  async login(loginDto: loginDto){
    const user = await this.userService.validateUser(loginDto.email, loginDto.password);
    const payload = {sub: user.id, email: user.email};
    const access_token = await this.jwtService.signAsync(payload);
    
    return {
      access_token,
      user: user,
    };
  }
}
