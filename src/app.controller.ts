import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('healthcheck')
  @ApiResponse({
    description: 'Aplicação está rodando',
    status: 200,
  })
  getHello(): { message: string } {
    return this.appService.getHello();
  }
}
