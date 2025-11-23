import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto){
    return this.authService.register(registerDto);
  }

  @Post('login')
  async login(@Body() loginDto: loginDto){
    return this.authService.login(loginDto);
  }
}
