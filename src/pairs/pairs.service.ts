import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CatsService } from 'src/cats/cats.service';
import { RickandmortyService } from 'src/rickandmorty/rickandmorty.service';

@Injectable()
export class PairsService {
  constructor(
    private readonly catsService: CatsService,
    private readonly rickandmortyService: RickandmortyService,
  ) {}

  async execute() {
    try {
      const cat = await this.catsService.getRandomCat();
      const character = await this.rickandmortyService.getRandomCharacter();

      if (!cat || !character) {
        throw new HttpException(
          { message: 'Ocorreu um erro ao relacionar gato com personagem' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return { character, cat };
    } catch {
      throw new HttpException(
        {
          message: 'Ocorreu um erro ao relacionar gato com personagem',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
