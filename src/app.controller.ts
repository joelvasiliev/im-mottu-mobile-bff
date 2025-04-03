import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health Check')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('healthcheck')
  @ApiOperation({ summary: 'Verifica se a aplicação está rodando' })
  @ApiResponse({
    status: 200,
    description: 'Aplicação está rodando',
    schema: {
      example: { message: 'App is running' },
    },
  })
  getHello(): { message: string } {
    return this.appService.getHello();
  }
}
