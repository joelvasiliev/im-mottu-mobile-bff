import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RedisCatRepository } from 'src/repositories/cache/redis-cat-repository';
import { CatRepository } from 'src/repositories/cat.repository';
import { RedisService } from 'src/config/redis';

@Module({
  imports: [HttpModule.register({})],
  controllers: [CatsController],
  providers: [
    CatsService,
    ConfigService,
    RedisService,
    RedisCatRepository,
    {
      provide: CatRepository,
      useClass: RedisCatRepository,
    },
  ],
  exports: [CatsService],
})
export class CatsModule {}
