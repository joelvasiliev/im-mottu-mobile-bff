import { ApiProperty } from '@nestjs/swagger';

export class Character {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  species: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  gender: string;

  @ApiProperty({ type: () => Object })
  origin: { name: string; url: string };

  @ApiProperty({ type: () => Object })
  location: { name: string; url: string };

  @ApiProperty()
  image: string;

  @ApiProperty({ type: [String] })
  episode: string[];

  @ApiProperty()
  url: string;

  @ApiProperty()
  created: string;
}
