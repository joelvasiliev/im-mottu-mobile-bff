import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './modules/cats/cats.module';
import { RickandmortyModule } from './modules/rickandmorty/rickandmorty.module';
import { PairsModule } from './modules/pairs/pairs.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import envConfig from './env.config';
import { CacheModule } from '@nestjs/cache-manager';
import { UserModule } from './modules/user/user.module';
import * as redisStore from 'cache-manager-redis-store';
import { PrismaService } from './config/prisma';
import { RedisService } from './config/redis';
import { AuthModule } from './modules/auth/auth.module';

console.log();

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [envConfig],
      isGlobal: true,
    }),

    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        store: redisStore,
        host: config.get<string>('REDIS_HOST'),
        port: config.get<number>('REDIS_PORT'),
        ttl: 1800,
      }),
    }),

    HttpModule,
    CatsModule,
    RickandmortyModule,
    PairsModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [RedisService, PrismaService, AppService],
  exports: [HttpModule],
})
export class AppModule {}
