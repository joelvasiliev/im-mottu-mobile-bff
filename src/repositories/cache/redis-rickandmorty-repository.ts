import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/config/redis';
import { RickAndMortyRepository } from '../rickandmorty.repository';
import { Character } from 'src/modules/rickandmorty/dto/character.dto';

@Injectable()
export class RedisRickAndMortyRepository implements RickAndMortyRepository {
  constructor(private readonly redis: RedisService) {}
  async getCachedCharacter(character_id: number) {
    const cached_character = await this.redis.get(`character-${character_id}`);

    if (!cached_character) return null;

    const parsed_cached_character: Character = JSON.parse(cached_character);

    return parsed_cached_character;
  }
  async getCachedSearch(search_query: string) {
    const cached_search = await this.redis.get(`search-${search_query}`);

    if (!cached_search) return null;

    const parsed_cached_search: Character[] = JSON.parse(cached_search);

    return parsed_cached_search;
  }

  async setCacheCharacter(character: Character): Promise<void> {
    await this.redis.set(
      `character-${character.id}`,
      JSON.stringify(character),
      'EX',
      120,
    );
  }

  async setCacheSearch(search_query: string, results: Character[]) {
    await this.redis.set(
      `search-${search_query}`,
      JSON.stringify(results),
      'EX',
      120,
    );
  }
}
