import { Module } from '@nestjs/common';
import { PairsController } from './pairs.controller';
import { PairsService } from './pairs.service';
import { HttpModule } from '@nestjs/axios';
import { RickandmortyService } from 'src/modules/rickandmorty/application/use-cases/rickandmorty.service';
import { CatsService } from 'src/modules/cats/application/use-cases';
import { ConfigService } from '@nestjs/config';
import { RedisCatRepository } from 'src/repositories/cache/redis-cat-repository';
import { RedisService } from 'src/config/redis';
import { RedisRickAndMortyRepository } from 'src/repositories/cache/redis-rickandmorty-repository';

@Module({
  imports: [HttpModule],
  controllers: [PairsController],
  providers: [
    ConfigService,
    PairsService,
    RickandmortyService,
    CatsService,
    RedisService,
    RedisCatRepository,
    RedisRickAndMortyRepository,
  ],
})
export class PairsModule {}
