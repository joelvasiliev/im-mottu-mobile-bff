import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Character } from 'src/modules/rickandmorty/dto/character.dto';
import { Pair } from './dto/pair.dto';
import { GetPairUseCase } from './application/use-cases/get-pair.use-case';
import { GetFavoritePairsUseCase } from './application/use-cases/get-favorites.use-case';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';

@ApiTags('Pairs Controller')
@Controller('v1/pairs')
export class PairsController {
  constructor(
    private readonly getPairUseCase: GetPairUseCase,
    private readonly getFavoritePairsUseCase: GetFavoritePairsUseCase,
  ) {}

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
    return await this.getPairUseCase.execute(characterName, catBreed);
  }

  @UseGuards(JwtAuthGuard)
  @Get('favorites')
  async getFavorites(
    @Req() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const userId = req.user.id;

    const result = await this.getFavoritePairsUseCase.execute({
      userId,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });

    return result;
  }
}
