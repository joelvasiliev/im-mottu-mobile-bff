import { ApiProperty } from '@nestjs/swagger';

export class InputGetFavoritePairsDto {
  @ApiProperty({
    description: 'ID do usuário logado',
    example: 'e89b8c88-45fd-4ad2-8fdd-123456789abc',
  })
  userId: string;

  @ApiProperty({
    description: 'Número da página para paginação',
    example: 1,
    required: false,
    default: 1,
  })
  page?: number;

  @ApiProperty({
    description: 'Quantidade de itens por página',
    example: 10,
    required: false,
    default: 10,
  })
  limit?: number;
}
