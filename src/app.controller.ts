import { Controller, Get } from '@nestjs/common';

@Controller('user')
export class AppController {

  @Get()
  getPerfil(): string {
    console.log("llegamos a getUser");
    return '¡Hola! CoinCrew Backend está funcionando correctamente';
  }
}