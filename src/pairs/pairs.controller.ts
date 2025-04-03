import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Character } from 'src/rickandmorty/rickandmorty.dto';
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
  @ApiResponse({
    status: 500,
    description: 'Ocorreu um erro na busca',
  })
  async get(): Promise<Pair> {
    return await this.pairsService.execute();
  }
}
