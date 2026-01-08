import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto){
    try {
      return await this.authService.register(registerDto);
    } catch (error) {
      this.logger.error('Error en register:', error);
      throw new HttpException(
        error.message || 'Error al registrar usuario',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('login')
  async login(@Body() loginDto: loginDto){
    try {
      return await this.authService.login(loginDto);
    } catch (error) {
      this.logger.error('Error en login:', error);
      throw new HttpException(
        error.message || 'Error al iniciar sesión',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
