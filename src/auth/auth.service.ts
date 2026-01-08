import { Injectable, Logger } from '@nestjs/common';
import { loginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly userService: UserService,
     private readonly jwtService: JwtService){}

  async register(registerDto: RegisterDto){
    try {
      const user = await this.userService.createUser(
        registerDto.first_name,
        registerDto.last_name,
        registerDto.email,
        registerDto.password
      );
      
      const payload = {sub: user.id, email: user.email};
      const access_token = await this.jwtService.signAsync(payload);
      
      return {
        access_token,
        user: user,
      };
    } catch (error) {
      this.logger.error('Error en register:', error);
      throw error;
    }
  }

  async login(loginDto: loginDto){
    try {
      const user = await this.userService.validateUser(loginDto.email, loginDto.password);
      const payload = {sub: user.id, email: user.email};
      const access_token = await this.jwtService.signAsync(payload);
      
      return {
        access_token,
        user: user,
      };
    } catch (error) {
      this.logger.error('Error en login:', error);
      throw error;
    }
  }
}
