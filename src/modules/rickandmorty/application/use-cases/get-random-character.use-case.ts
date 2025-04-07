import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MAX_CHARACTER_ID } from 'src/modules/rickandmorty/constants/character.constants';
import { RedisRickAndMortyRepository } from 'src/modules/rickandmorty/infra/cache/redis-rickandmorty-repository';
import { RickAndMortyApiRepository } from 'src/repositories/http/rick-and-morty-api-repository';
import { Character } from 'src/modules/rickandmorty/dto';

@Injectable()
export class GetRandomCharacterUseCase {
  constructor(
    private readonly redisRickAndMortyRepository: RedisRickAndMortyRepository,
    private readonly rickAndMortyApiRepository: RickAndMortyApiRepository,
  ) {}

  private getRandomNumber(): number {
    return Math.floor(Math.random() * MAX_CHARACTER_ID) + 1;
  }

  async execute(): Promise<Character> {
    const randomId = this.getRandomNumber();

    const cached_character =
      await this.redisRickAndMortyRepository.getCachedCharacter(randomId);
    if (cached_character) {
      console.log('Returned character from cache');
      return cached_character;
    }

    const character =
      await this.rickAndMortyApiRepository.getCharacterById(randomId);

    if (!character.id || !character.name || !character.image) {
      throw new HttpException(
        {
          message:
            'Os dados retornados da The Rick and Morty API estão inválidos',
          details: character,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return character;
  }
}
