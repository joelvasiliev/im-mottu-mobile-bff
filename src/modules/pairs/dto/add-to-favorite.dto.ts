import { ApiProperty } from '@nestjs/swagger';

export class AddFavoriteDto {
  @ApiProperty({
    example: 'user123',
    description: 'ID do usuário que está adicionando o favorito',
  })
  userId: string;

  @ApiProperty({
    example: 42,
    description: 'ID do personagem da API Rick and Morty',
  })
  characterId: number;

  @ApiProperty({
    example: 'cat_abc123',
    description: 'ID do gato aleatório',
  })
  catId: string;
}
