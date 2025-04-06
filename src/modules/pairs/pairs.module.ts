import { Module } from '@nestjs/common';
import { PairsController } from './pairs.controller';
import { GetPairUseCase } from './application/use-cases/get-pair.use-case';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RedisCatRepository } from 'src/repositories/cache/redis-cat-repository';
import { RedisService } from 'src/config/redis';
import { RedisRickAndMortyRepository } from 'src/repositories/cache/redis-rickandmorty-repository';
import { GetRandomCatByBreedUseCase } from '../cats/application/use-cases/get-random-cat-by-breed.use-case';
import {
  GetRandomCharacterByNameUseCase,
  GetRandomCharacterUseCase,
} from '../rickandmorty/application/use-cases';
import { GetRandomCatUseCase } from '../cats/application/use-cases/get-random-cat.use-case';
import { CatsModule } from '../cats/cats.module';
import { RickandmortyModule } from '../rickandmorty/rickandmorty.module';

@Module({
  imports: [HttpModule, CatsModule, RickandmortyModule],
  controllers: [PairsController],
  providers: [
    ConfigService,
    GetPairUseCase,
    GetRandomCatUseCase,
    GetRandomCharacterUseCase,
    GetRandomCharacterByNameUseCase,
    GetRandomCatByBreedUseCase,
    RedisService,
    RedisCatRepository,
    RedisRickAndMortyRepository,
  ],
})
export class PairsModule {}
