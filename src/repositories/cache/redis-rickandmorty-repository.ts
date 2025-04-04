import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/config/redis';
import { RickAndMortyRepository } from '../rickandmorty.repository';
import { Character } from 'src/modules/rickandmorty/rickandmorty.dto';

@Injectable()
export class RedisRickAndMortyRepository implements RickAndMortyRepository {
  constructor(private readonly redis: RedisService) {}
  async getCachedCharacter(character_id: number) {
    const cached_character = await this.redis.get(`character-${character_id}`);

    if (!cached_character) return null;

    const parsed_cached_character: Character = JSON.parse(cached_character);

    return parsed_cached_character;
  }

  async setCacheCharacter(character: Character): Promise<void> {
    await this.redis.set(
      `character-${character.id}`,
      JSON.stringify(character),
      'EX',
      120,
    );
  }
}
