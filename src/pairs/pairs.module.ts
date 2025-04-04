import { Module } from '@nestjs/common';
import { PairsController } from './pairs.controller';
import { PairsService } from './pairs.service';
import { HttpModule } from '@nestjs/axios';
import { RickandmortyService } from 'src/rickandmorty/rickandmorty.service';
import { CatsService } from 'src/cats/cats.service';
import { ConfigService } from '@nestjs/config';
import { RedisCatRepository } from 'src/repositories/cache/redis-cat-repository';
import { RedisService } from 'src/config/redis';

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
  ],
})
export class PairsModule {}
