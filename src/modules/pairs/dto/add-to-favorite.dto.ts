import { ApiProperty } from '@nestjs/swagger';

export class AddFavoriteDto {
  @ApiProperty({
    example: 42,
    description: 'ID do personagem da API Rick and Morty',
  })
  character_id: number;

  @ApiProperty({
    example: 'cat_abc123',
    description: 'ID do gato aleatório',
  })
  cat_id: string;
}
