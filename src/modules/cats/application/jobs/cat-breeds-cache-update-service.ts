import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ListBreedsUseCase } from '../use-cases';

@Injectable()
export class CacheUpdateService {
  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly listBreedsUseCase: ListBreedsUseCase,
  ) {}

  @Cron(CronExpression.EVERY_10_MINUTES)
  async handleCacheUpdate() {
    const breeds = await this.listBreedsUseCase.execute();

    await this.cacheManager.set('cat_breeds', breeds, 3600);
    console.log('Cache atualizado com sucesso');
  }
}
