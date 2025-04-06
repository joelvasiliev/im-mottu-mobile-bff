import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CatsService } from 'src/modules/cats/application/use-cases';
import { RickandmortyService } from 'src/modules/rickandmorty/application/use-cases/rickandmorty.service';

@Injectable()
export class PairsService {
  constructor(
    private readonly catsService: CatsService,
    private readonly rickandmortyService: RickandmortyService,
  ) {}

  async execute(character_name?: string, cat_breed?: string) {
    try {
      console.log(cat_breed);
      const cat = cat_breed
        ? await this.catsService.getRandomCatByBreed(cat_breed)
        : await this.catsService.getRandomCat();

      const character = character_name
        ? await this.rickandmortyService.getRandomCharacterByName(
            character_name,
          )
        : await this.rickandmortyService.getRandomCharacter();

      if (!cat || !character) {
        throw new HttpException(
          { message: 'Ocorreu um erro ao relacionar gato com personagem' },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return { character, cat };
    } catch (e: any) {
      throw new HttpException(
        {
          message: e.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
