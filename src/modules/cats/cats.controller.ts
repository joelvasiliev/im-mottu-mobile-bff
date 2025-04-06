import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Cat, CatBreedResponse } from './dto';
import { GetRandomCatUseCase } from './application/use-cases/get-random-cat.use-case';
import { ListBreedsUseCase } from './application/use-cases/list-breeds.use-case';

@ApiTags('Cats')
@Controller('v1/cats')
export class CatsController {
  constructor(
    private readonly getRandomCatUseCase: GetRandomCatUseCase,
    private readonly listBreedsUseCase: ListBreedsUseCase,
  ) {}

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
  async getRandomCat(): Promise<Cat> {
    return await this.getRandomCatUseCase.execute();
  }

  @Get('breeds')
  @ApiOperation({ summary: 'Obtém uma lista das raças de gatos' })
  @ApiResponse({
    status: 200,
    description: 'Lista de raça de gatos de exemplo',
    type: [CatBreedResponse],
  })
  @ApiResponse({
    status: 500,
    description: 'Erro ao buscar dados da TheCatAPI',
  })
  async getBreeds(): Promise<CatBreedResponse[]> {
    return await this.listBreedsUseCase.execute();
  }
}
