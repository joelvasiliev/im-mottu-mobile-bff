import { Injectable } from '@nestjs/common';
import { CatRepository } from '../cat.repository';
import { RedisService } from 'src/config/redis';
import { CatsService } from 'src/cats/cats.service';
import { CatBreedResponse } from 'src/cats/cats.dto';

@Injectable()
export class RedisCatRepository implements CatRepository {
  constructor(
    private readonly redis: RedisService,
    private readonly catService: CatsService,
  ) {}

  async get() {
    const cat = await this.catService.getRandomCat();
    return cat;
  }

  async getBreeds() {
    const cached_breeds = await this.redis.get('cat_breeds');
    if (!cached_breeds) {
      const breeds = await this.catService.getBreeds();
      await this.redis.set('cat_breeds', JSON.stringify(breeds), 'EX', 15);
      console.log('from db');
      return breeds;
    }

    const parsed_cached_breeds: CatBreedResponse[] = JSON.parse(cached_breeds);
    console.log('from cache');
    return parsed_cached_breeds;
  }
}
