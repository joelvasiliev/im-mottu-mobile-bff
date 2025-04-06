import { Module } from '@nestjs/common';
import { RickandmortyController } from './rickandmorty.controller';
import { RickandmortyService } from './application/use-cases/rickandmorty.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/config/redis';
import { RedisRickAndMortyRepository } from 'src/repositories/cache/redis-rickandmorty-repository';
import { RickAndMortyRepository } from 'src/repositories/rickandmorty.repository';
import {
  GetRandomCharacterByNameUseCase,
  GetRandomCharacterUseCase,
} from './application/use-cases';
import { RickAndMortyApiHttpRepository } from './infra/http/rick-and-morty-api.repository';
import { RickAndMortyApiRepository } from 'src/repositories/http/rick-and-morty-api-repository';

@Module({
  imports: [HttpModule.register({})],
  controllers: [RickandmortyController],
  providers: [
    RickandmortyService,
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
  exports: [RickandmortyService],
})
export class RickandmortyModule {}
