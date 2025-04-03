import { Module } from '@nestjs/common';
import { PairsController } from './pairs.controller';
import { PairsService } from './pairs.service';
import { HttpModule } from '@nestjs/axios';
import { RickandmortyService } from 'src/rickandmorty/rickandmorty.service';
import { CatsService } from 'src/cats/cats.service';

@Module({
  imports: [HttpModule],
  controllers: [PairsController],
  providers: [PairsService, RickandmortyService, CatsService],
})
export class PairsModule {}
