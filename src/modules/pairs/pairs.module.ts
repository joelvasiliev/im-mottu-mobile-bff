import { Module } from '@nestjs/common';
import { PairsController } from './pairs.controller';
import { GetPairUseCase } from './application/use-cases/get-pair.use-case';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { RedisCatRepository } from 'src/modules/cats/infra/cache/redis-cat-repository';
import { RedisService } from 'src/config/redis';
import { GetRandomCatByBreedUseCase } from 'src/modules/cats/application/use-cases/get-random-cat-by-breed.use-case';
import {
  GetRandomCharacterByNameUseCase,
  GetRandomCharacterUseCase,
} from '../rickandmorty/application/use-cases';
import { GetRandomCatUseCase } from 'src/modules/cats/application/use-cases/get-random-cat.use-case';
import { CatsModule } from 'src/modules/cats/cats.module';
import { RickandmortyModule } from 'src/modules/rickandmorty/rickandmorty.module';
import { RedisRickAndMortyRepository } from 'src/modules/rickandmorty/infra/cache/redis-rickandmorty-repository';
import { UserRepository } from 'src/repositories/prisma/user-repository';
import { PrismaUserRepository } from '../user/infra/database/prisma-user.repository';
import { PrismaService } from 'src/config/prisma';
import { GetFavoritePairsUseCase } from './application/use-cases/get-favorites.use-case';
import { AuthModule } from '../auth/auth.module';
import { AddPairToFavoriteUseCase } from './application/use-cases/add-pair-to-favorites.use-case';

@Module({
  imports: [HttpModule, CatsModule, RickandmortyModule, AuthModule],
  controllers: [PairsController],
  providers: [
    PrismaService,
    ConfigService,
    AddPairToFavoriteUseCase,
    GetPairUseCase,
    GetFavoritePairsUseCase,
    GetRandomCatUseCase,
    GetRandomCharacterUseCase,
    GetRandomCharacterByNameUseCase,
    GetRandomCatByBreedUseCase,
    RedisService,
    RedisCatRepository,
    RedisRickAndMortyRepository,
    PrismaUserRepository,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [GetFavoritePairsUseCase, GetPairUseCase],
})
export class PairsModule {}
