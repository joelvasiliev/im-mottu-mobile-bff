import { Controller, Get } from '@nestjs/common';
import { RickandmortyService } from './rickandmorty.service';
import {
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Character } from './rickandmorty.dto';

@ApiTags('Rick and Morty')
@Controller('v1/rickandmorty')
export class RickandmortyController {
  constructor(private readonly rickandmortyService: RickandmortyService) {}

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
    return await this.rickandmortyService.getRandomCharacter();
  }
}
