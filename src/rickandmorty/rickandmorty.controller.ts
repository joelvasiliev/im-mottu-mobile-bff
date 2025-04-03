import { Controller, Get } from '@nestjs/common';
import { RickandmortyService } from './rickandmorty.service';
import { ApiOkResponse, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Character } from './rickandmorty.dto';

@ApiTags('Rick and Morty')
@Controller('v1/rickandmorty')
export class RickandmortyController {
  constructor(private readonly rickandmortyService: RickandmortyService) {}

  @Get('get-random-character')
  @ApiOkResponse({
    description: 'Retornou com sucesso um personagem aleatório',
    type: Character,
    content: {
      'application/json': {
        example: {
          id: 826,
          name: 'Butter Robot',
          status: 'unknown',
          species: 'Robot',
          type: '',
          gender: 'unknown',
          origin: {
            name: 'unknown',
            url: '',
          },
          location: {
            name: 'Earth (Replacement Dimension)',
            url: 'https://rickandmortyapi.com/api/location/20',
          },
          image: 'https://rickandmortyapi.com/api/character/avatar/826.jpeg',
          episode: [
            'https://rickandmortyapi.com/api/episode/10',
            'https://rickandmortyapi.com/api/episode/22',
          ],
          url: 'https://rickandmortyapi.com/api/character/826',
          created: '2021-11-01T12:34:56.789Z',
        },
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Ocorreu um erro na busca',
  })
  async get() {
    return await this.rickandmortyService.getRandomCharacter();
  }
}
