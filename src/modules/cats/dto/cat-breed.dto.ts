import { ApiProperty } from '@nestjs/swagger';

export class CatBreedWeight {
  @ApiProperty({
    example: '7 - 10',
    description: 'Peso em libras (sistema imperial)',
  })
  imperial: string;

  @ApiProperty({
    example: '3 - 5',
    description: 'Peso em quilogramas (sistema métrico)',
  })
  metric: string;
}

export class CatBreed {
  @ApiProperty({
    type: () => CatBreedWeight,
    description: 'Peso médio da raça',
  })
  weight: CatBreedWeight;

  @ApiProperty({ example: 'abys', description: 'Identificador da raça' })
  id: string;

  @ApiProperty({ example: 'Abyssinian', description: 'Nome da raça' })
  name: string;

  @ApiProperty({
    example: 'http://cfa.org/Breeds/BreedsAB/Abyssinian.aspx',
    description: 'Link para o site CFA com informações da raça',
  })
  cfa_url: string;

  @ApiProperty({
    example: 'http://www.vetstreet.com/cats/abyssinian',
    description: 'Link para o site Vetstreet com informações da raça',
  })
  vetstreet_url: string;

  @ApiProperty({
    example: 'https://vcahospitals.com/know-your-pet/cat-breeds/abyssinian',
    description: 'Link para o site VCA Hospitals com informações da raça',
  })
  vcahospitals_url: string;

  @ApiProperty({
    example: 'Active, Energetic, Independent, Intelligent, Gentle',
    description: 'Temperamento da raça',
  })
  temperament: string;

  @ApiProperty({ example: 'Egypt', description: 'País de origem da raça' })
  origin: string;

  @ApiProperty({
    example: 'EG',
    description: 'Códigos do país (pode haver múltiplos)',
  })
  country_codes: string;

  @ApiProperty({ example: 'EG', description: 'Código do país' })
  country_code: string;

  @ApiProperty({
    example:
      'The Abyssinian is easy to care for, and a joy to have in your home...',
    description: 'Descrição geral da raça',
  })
  description: string;

  @ApiProperty({
    example: '14 - 15',
    description: 'Expectativa de vida da raça em anos',
  })
  life_span: string;

  @ApiProperty({
    example: 0,
    description:
      'Indica se a raça é predominantemente indoor (1 = sim, 0 = não)',
  })
  indoor: number;

  @ApiProperty({
    example: 1,
    description: 'Indica se a raça gosta de colo (1 = sim, 0 = não)',
  })
  lap: number;

  @ApiProperty({
    example: '',
    description: 'Nomes alternativos da raça (se houver)',
  })
  alt_names: string;

  @ApiProperty({ example: 5, description: 'Nível de adaptabilidade (1 a 5)' })
  adaptability: number;

  @ApiProperty({ example: 5, description: 'Nível de afeto (1 a 5)' })
  affection_level: number;

  @ApiProperty({
    example: 3,
    description: 'Compatibilidade com crianças (1 a 5)',
  })
  child_friendly: number;

  @ApiProperty({ example: 4, description: 'Compatibilidade com cães (1 a 5)' })
  dog_friendly: number;

  @ApiProperty({ example: 5, description: 'Nível de energia (1 a 5)' })
  energy_level: number;

  @ApiProperty({
    example: 1,
    description: 'Facilidade de cuidado com a pelagem (1 a 5)',
  })
  grooming: number;

  @ApiProperty({
    example: 2,
    description: 'Propensão a problemas de saúde (1 a 5)',
  })
  health_issues: number;

  @ApiProperty({ example: 5, description: 'Inteligência da raça (1 a 5)' })
  intelligence: number;

  @ApiProperty({ example: 2, description: 'Nível de queda de pelos (1 a 5)' })
  shedding_level: number;

  @ApiProperty({ example: 5, description: 'Necessidades sociais (1 a 5)' })
  social_needs: number;

  @ApiProperty({
    example: 5,
    description: 'Sociabilidade com estranhos (1 a 5)',
  })
  stranger_friendly: number;

  @ApiProperty({ example: 1, description: 'Nível de vocalização (1 a 5)' })
  vocalisation: number;

  @ApiProperty({
    example: 0,
    description: 'É uma raça experimental? (1 = sim, 0 = não)',
  })
  experimental: number;

  @ApiProperty({
    example: 0,
    description: 'É uma raça sem pelos? (1 = sim, 0 = não)',
  })
  hairless: number;

  @ApiProperty({
    example: 1,
    description: 'É uma raça natural? (1 = sim, 0 = não)',
  })
  natural: number;

  @ApiProperty({
    example: 0,
    description: 'É uma raça rara? (1 = sim, 0 = não)',
  })
  rare: number;

  @ApiProperty({
    example: 0,
    description: 'Possui características de pelagem “rex”? (1 = sim, 0 = não)',
  })
  rex: number;

  @ApiProperty({
    example: 0,
    description: 'Possui cauda suprimida? (1 = sim, 0 = não)',
  })
  suppressed_tail: number;

  @ApiProperty({
    example: 0,
    description: 'Possui pernas curtas? (1 = sim, 0 = não)',
  })
  short_legs: number;

  @ApiProperty({
    example: 'https://en.wikipedia.org/wiki/Abyssinian_(cat)',
    description: 'Link para o artigo da Wikipedia',
  })
  wikipedia_url: string;

  @ApiProperty({
    example: 0,
    description: 'É hipoalergênica? (1 = sim, 0 = não)',
  })
  hypoallergenic: number;

  @ApiProperty({
    example: '0XYvRd7oD',
    description: 'ID da imagem de referência',
  })
  reference_image_id: string;
}

export class CatBreedResponse {
  @ApiProperty({ example: 'abys', description: 'Identificador da raça' })
  id: string;

  @ApiProperty({ example: 'Abyssinian', description: 'Nome da raça' })
  name: string;
}
