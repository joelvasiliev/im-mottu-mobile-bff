import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Pair } from './dto/pair.dto';
import { GetPairUseCase } from './application/use-cases/get-pair.use-case';
import { GetFavoritePairsUseCase } from './application/use-cases/get-favorites.use-case';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';
import { AddPairToFavoriteUseCase } from './application/use-cases/add-pair-to-favorites.use-case';
import { AddFavoriteDto } from './dto/add-to-favorite.dto';

@ApiTags('Pairs')
@Controller('v1/pairs')
export class PairsController {
  constructor(
    private readonly getPairUseCase: GetPairUseCase,
    private readonly getFavoritePairsUseCase: GetFavoritePairsUseCase,
    private readonly addPairToFavoriteUseCase: AddPairToFavoriteUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Relaciona um personagem do Rick and Morty com um gato aleatório',
    description:
      'Retorna um par com informações de um personagem do Rick and Morty e um gato aleatório. Pode ser filtrado pelo nome do personagem e raça do gato.',
  })
  @ApiQuery({
    name: 'character_name',
    required: false,
    type: String,
    example: 'Rick Sanchez',
    description: 'Nome do personagem do Rick and Morty (parcial ou completo)',
  })
  @ApiQuery({
    name: 'cat_breed',
    required: false,
    type: String,
    example: 'Siberian',
    description: 'Raça do gato (parcial ou completa)',
  })
  @ApiResponse({
    status: 200,
    description: 'Relacionamento encontrado com sucesso',
    type: Pair,
  })
  @ApiResponse({
    status: 500,
    description: 'Erro interno ao buscar o par',
  })
  async get(
    @Query('character_name') characterName?: string,
    @Query('cat_breed') catBreed?: string,
  ): Promise<Pair> {
    return await this.getPairUseCase.execute(characterName, catBreed);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('favorites')
  @ApiOperation({
    summary: 'Lista os pares favoritos do usuário autenticado',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    example: 1,
    description: 'Número da página para paginação (default: 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    example: 10,
    description: 'Quantidade de itens por página (default: 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de pares favoritos retornada com sucesso',
    schema: {
      example: {
        total: 1,
        page: 1,
        limit: 10,
        data: [
          {
            character: {
              id: 1,
              name: 'Morty Smith',
            },
            cat: {
              id: 'abc123',
              name: 'Mittens',
              breed: 'Siberian',
            },
          },
        ],
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente',
  })
  async getFavorites(
    @Req() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    const userId = req.user.sub;

    const result = await this.getFavoritePairsUseCase.execute({
      userId,
      page: Number(page) || 1,
      limit: Number(limit) || 10,
    });

    return result;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('favorite')
  @ApiOperation({
    summary: 'Adiciona um par aos favoritos do usuário autenticado',
  })
  @ApiBody({
    type: AddFavoriteDto,
    examples: {
      example1: {
        summary: 'Exemplo de requisição',
        value: {
          character_id: 1,
          cat_id: 'abc123',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Par adicionado aos favoritos com sucesso',
    schema: {
      example: {
        success: true,
        message: 'Par adicionado com sucesso',
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Requisição malformada ou IDs inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Token de autenticação inválido ou ausente',
  })
  async addFavorite(@Body() body: AddFavoriteDto, @Req() req) {
    const userId: string = req.user.sub;

    const result = await this.addPairToFavoriteUseCase.execute(
      userId,
      body.character_id,
      body.cat_id,
    );

    return result;
  }
}
