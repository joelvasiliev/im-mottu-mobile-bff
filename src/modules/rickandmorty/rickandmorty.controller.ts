import { Controller, Get } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Character } from './dto/character.dto';
import { GetRandomCharacterUseCase } from './application/use-cases';

@ApiTags('Rick and Morty')
@Controller('v1/rickandmorty')
export class RickandmortyController {
  constructor(
    private readonly getRandomCharacterUseCase: GetRandomCharacterUseCase,
  ) {}

  @Get('get-random-character')
  @ApiOperation({ summary: 'Obtém um personagem de Rick and Morty aleatório' })
  @ApiOkResponse({
    description: 'Retornou com sucesso um personagem aleatório',
    type: Character,
  })
  @ApiResponse({
    status: 500,
    description: 'Ocorreu um erro na busca',
  })
  async get(): Promise<Character> {
    return await this.getRandomCharacterUseCase.execute();
  }
}
