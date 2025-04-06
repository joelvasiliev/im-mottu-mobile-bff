import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Character } from 'src/modules/rickandmorty/dto/character.dto';
import { Pair } from './pairs.dto';
import { PairsService } from './pairs.service';

@ApiTags('Pairs Controller')
@Controller('v1/pairs')
export class PairsController {
  constructor(private readonly pairsService: PairsService) {}

  @Get()
  @ApiOkResponse({
    description: 'Relacionou com sucesso um personagem à um gato',
    type: Character,
  })
  @ApiOperation({
    summary: 'Relaciona um personagem do Rick and Morty com um gato aleatório',
  })
  @ApiResponse({
    status: 500,
    description: 'Ocorreu um erro na busca',
  })
  @ApiQuery({ name: 'character_name', required: false, type: String })
  @ApiQuery({ name: 'cat_breed', required: false, type: String })
  async get(
    @Query('character_name') characterName?: string,
    @Query('cat_breed') catBreed?: string,
  ): Promise<Pair> {
    console.log(characterName);
    return await this.pairsService.execute(characterName, catBreed);
  }
}
