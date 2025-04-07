import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RedisCatRepository } from 'src/modules/cats/infra/cache/redis-cat-repository';
import { CatRepository } from 'src/repositories/cache/cat.repository';
import { RedisService } from 'src/config/redis';
import { GetRandomCatByBreedUseCase } from './application/use-cases/get-random-cat-by-breed.use-case';
import { ListBreedsUseCase } from './application/use-cases/list-breeds.use-case';
import { GetRandomCatUseCase } from './application/use-cases/get-random-cat.use-case';
import { CatApiHttpRepository } from './infra/http/cat-api.http.repository';
import { CatApiRepository } from 'src/repositories/http/cat-api-repository';

@Module({
  imports: [HttpModule.register({})],
  controllers: [CatsController],
  providers: [
    GetRandomCatUseCase,
    GetRandomCatByBreedUseCase,
    ListBreedsUseCase,
    ConfigService,
    RedisService,
    RedisCatRepository,
    {
      provide: CatApiRepository,
      useClass: CatApiHttpRepository,
    },
    {
      provide: CatRepository,
      useClass: RedisCatRepository,
    },
  ],
  exports: [
    CatApiRepository,
    GetRandomCatUseCase,
    GetRandomCatByBreedUseCase,
    ListBreedsUseCase,
  ],
})
export class CatsModule {}
