import { Injectable } from '@nestjs/common';
import { RickAndMortyApiRepository } from 'src/repositories/http/rick-and-morty-api-repository';
import { Character } from 'src/modules/rickandmorty/dto';
import { RedisRickAndMortyRepository } from 'src/modules/rickandmorty/infra/cache/redis-rickandmorty-repository';

@Injectable()
export class GetRandomCharacterByNameUseCase {
  constructor(
    private readonly redisRickAndMortyRepository: RedisRickAndMortyRepository,
    private readonly rickAndMortyApiRepository: RickAndMortyApiRepository,
  ) {}
  async execute(character_name: string): Promise<Character> {
    const cached_search =
      await this.redisRickAndMortyRepository.getCachedSearch(
        character_name.trim().toLowerCase(),
      );
    if (cached_search) {
      console.log('Returned search from cache');
      return cached_search[Math.floor(Math.random() * cached_search.length)];
    }
    console.log('fetch api');
    const { info, results } =
      await this.rickAndMortyApiRepository.listCharactersByNamePaginated(
        character_name,
        1,
      );

    const full_results: Character[] = results;

    if (info.pages > 1) {
      for (let page = 2; page <= info.pages; page++) {
        const nextPage =
          await this.rickAndMortyApiRepository.listCharactersByNamePaginated(
            character_name,
            page,
          );
        full_results.push(...nextPage.results);
      }
    }
    await this.redisRickAndMortyRepository.setCacheSearch(
      character_name,
      full_results,
    );

    const randomCharacter =
      full_results[Math.floor(Math.random() * full_results.length)];

    return randomCharacter;
  }
}
