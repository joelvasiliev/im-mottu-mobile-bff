import { Module } from '@nestjs/common';
import { RickandmortyController } from './rickandmorty.controller';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/config/redis';
import { RickAndMortyRepository } from 'src/repositories/cache/rickandmorty.repository';
import {
  GetRandomCharacterByNameUseCase,
  GetRandomCharacterUseCase,
} from './application/use-cases';
import { RickAndMortyApiHttpRepository } from './infra/http/rick-and-morty-api.repository';
import { RickAndMortyApiRepository } from 'src/repositories/http/rick-and-morty-api-repository';
import { RedisRickAndMortyRepository } from './infra/cache/redis-rickandmorty-repository';

@Module({
  imports: [HttpModule.register({})],
  controllers: [RickandmortyController],
  providers: [
    GetRandomCharacterUseCase,
    GetRandomCharacterByNameUseCase,
    ConfigService,
    RedisService,
    RedisRickAndMortyRepository,
    {
      provide: RickAndMortyApiRepository,
      useClass: RickAndMortyApiHttpRepository,
    },
    {
      provide: RickAndMortyRepository,
      useClass: RedisRickAndMortyRepository,
    },
  ],
  exports: [
    RickAndMortyApiRepository,
    GetRandomCharacterUseCase,
    GetRandomCharacterByNameUseCase,
  ],
})
export class RickandmortyModule {}
