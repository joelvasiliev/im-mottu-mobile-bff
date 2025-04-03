import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CatsService } from './cats.service';
import { Cat } from './cats.dto';

@ApiTags('Cats')
@Controller('v1/cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Get('get-random-cat')
  @ApiOperation({ summary: 'Obtém uma imagem aleatória de um gato' })
  @ApiResponse({
    status: 200,
    description: 'Imagem aleatória de um gato retornada com sucesso',
    type: Cat,
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao buscar dados da TheCatAPI',
  })
  async get(): Promise<Cat> {
    return await this.catsService.getRandomCat();
  }
}
