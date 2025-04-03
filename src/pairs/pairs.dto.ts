import { ApiProperty } from '@nestjs/swagger';
import { Cat } from 'src/cats/cats.dto';
import { Character } from 'src/rickandmorty/rickandmorty.dto';

export class Pair {
  @ApiProperty({ type: () => Character })
  character: Character;

  @ApiProperty({ type: () => Cat })
  cat: Cat;
}
