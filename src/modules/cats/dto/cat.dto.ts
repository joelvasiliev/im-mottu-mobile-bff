import { ApiProperty } from '@nestjs/swagger';

export class Cat {
  @ApiProperty({ example: 'ed8', description: 'ID da imagem do gato' })
  id: string;

  @ApiProperty({
    example: 'https://cdn2.thecatapi.com/images/ed8.jpg',
    description: 'URL da imagem do gato',
  })
  url: string;

  @ApiProperty({ example: 500, description: 'Largura da imagem' })
  width: number;

  @ApiProperty({ example: 500, description: 'Altura da imagem' })
  height: number;
}
