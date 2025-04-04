import { Injectable } from '@nestjs/common';
import { CatRepository } from '../cat.repository';
import { RedisService } from 'src/config/redis';
import { CatBreedResponse } from 'src/cats/cats.dto';

@Injectable()
export class RedisCatRepository implements CatRepository {
  constructor(private readonly redis: RedisService) {}
  async getCachedBreeds() {
    const cached_breeds = await this.redis.get('cat_breeds');

    if (!cached_breeds) return null;

    const parsed_cached_breeds: CatBreedResponse[] = JSON.parse(cached_breeds);
    console.log('from cache');
    return parsed_cached_breeds;
  }

  async setCacheBreeds(breeds: CatBreedResponse[]): Promise<void> {
    await this.redis.set('cat_breeds', JSON.stringify(breeds), 'EX', 15);
  }
}
