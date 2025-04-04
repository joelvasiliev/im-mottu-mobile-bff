import { Module } from '@nestjs/common';
import { RickandmortyController } from './rickandmorty.controller';
import { RickandmortyService } from './rickandmorty.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [HttpModule],
  controllers: [RickandmortyController],
  providers: [RickandmortyService, ConfigService],
  exports: [RickandmortyService],
})
export class RickandmortyModule {}
