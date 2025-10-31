import { Injectable } from '@nestjs/common';
import { loginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService,
     private readonly jwtService: JwtService){}

  async login(loginDto: loginDto){
    console.log("llegamos a login", {loginDto});
    const user = await this.userService.validateUser(loginDto.email, loginDto.password);
    console.log("user validado");
    console.log("user", user);
    const payload = {sub: user.id, email: user.email};
    const access_token = await this.jwtService.signAsync(payload);
    console.log("access_token", access_token);
    console.log("devolviendo access_token y user");
    console.log("access_token", access_token);
    console.log("user", user);
    return {
      access_token,
      user: user,
    };
  }
}
