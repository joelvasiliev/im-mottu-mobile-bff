import { ApiProperty } from '@nestjs/swagger';
import { Cat } from 'src/modules/cats/dto/cat.dto';
import { Character } from 'src/modules/rickandmorty/dto/character.dto';

export class Pair {
  @ApiProperty({ type: () => Character })
  character: Character;

  @ApiProperty({ type: () => Cat })
  cat: Cat;
}
