import { Injectable } from '@nestjs/common';
import { GetRandomCatUseCase } from 'src/modules/cats/application/use-cases/get-random-cat.use-case';
import { GetRandomCatByBreedUseCase } from 'src/modules/cats/application/use-cases/get-random-cat-by-breed.use-case';
import { GetRandomCharacterUseCase } from 'src/modules/rickandmorty/application/use-cases/get-random-character.use-case';
import { GetRandomCharacterByNameUseCase } from 'src/modules/rickandmorty/application/use-cases/get-random-character-by-name.use-case';

@Injectable()
export class GetPairUseCase {
  constructor(
    private readonly getRandomCatUseCase: GetRandomCatUseCase,
    private readonly getRandomCatByBreedUseCase: GetRandomCatByBreedUseCase,
    private readonly getRandomCharacterUseCase: GetRandomCharacterUseCase,
    private readonly getRandomCharacterByNameUseCase: GetRandomCharacterByNameUseCase,
  ) {}

  async execute(character_name?: string, cat_breed?: string) {
    const cat = cat_breed
      ? await this.getRandomCatByBreedUseCase.execute(cat_breed)
      : await this.getRandomCatUseCase.execute();

    const character = character_name
      ? await this.getRandomCharacterByNameUseCase.execute(character_name)
      : await this.getRandomCharacterUseCase.execute();

    return { character, cat };
  }
}
