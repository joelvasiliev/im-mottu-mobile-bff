import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { RickandmortyModule } from './rickandmorty/rickandmorty.module';
import { PairsModule } from './pairs/pairs.module';
import { HttpModule } from '@nestjs/axios';
import { RickandmortyService } from './rickandmorty/rickandmorty.service';

@Module({
  imports: [HttpModule, CatsModule, RickandmortyModule, PairsModule],
  controllers: [AppController],
  providers: [AppService, RickandmortyService],
  exports: [HttpModule],
})
export class AppModule {}
