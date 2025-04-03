import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsModule } from './cats/cats.module';
import { RickandmortyModule } from './rickandmorty/rickandmorty.module';
import { PairsModule } from './pairs/pairs.module';

@Module({
  imports: [CatsModule, RickandmortyModule, PairsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
