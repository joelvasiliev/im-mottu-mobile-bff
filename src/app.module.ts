import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './modules/cats/cats.module';
import { RickandmortyModule } from './modules/rickandmorty/rickandmorty.module';
import { PairsModule } from './modules/pairs/pairs.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import envConfig from './env.config';
import { CacheModule } from '@nestjs/cache-manager';
import { UserModule } from './modules/user/user.module';
import * as redisStore from 'cache-manager-redis-store';
import { PrismaService } from './config/prisma';
import { RedisService } from './config/redis';

@Module({
  imports: [
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: 1800,
    }),
    ConfigModule.forRoot({
      load: [envConfig],
      isGlobal: true,
    }),
    HttpModule,
    CatsModule,
    RickandmortyModule,
    PairsModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [RedisService, PrismaService, AppService],
  exports: [HttpModule],
})
export class AppModule {}
