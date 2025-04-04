import { Module } from '@nestjs/common';
import { RickandmortyController } from './rickandmorty.controller';
import { RickandmortyService } from './rickandmorty.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/config/redis';
import { RedisRickAndMortyRepository } from 'src/repositories/cache/redis-rickandmorty-repository';
import { RickAndMortyRepository } from 'src/repositories/rickandmorty.repository';

@Module({
  imports: [HttpModule.register({})],
  controllers: [RickandmortyController],
  providers: [
    RickandmortyService,
    ConfigService,
    RedisService,
    RedisRickAndMortyRepository,
    {
      provide: RickAndMortyRepository,
      useClass: RedisRickAndMortyRepository,
    },
  ],
  exports: [RickandmortyService],
})
export class RickandmortyModule {}
