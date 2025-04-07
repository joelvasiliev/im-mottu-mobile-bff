import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'email@email.com' })
  email: string;

  @ApiProperty({ example: 'senha' })
  password: string;
}
