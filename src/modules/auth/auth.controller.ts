import { Body, Controller, Post } from '@nestjs/common';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { LoginDto } from './dto/login.dto';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('v1/auth')
export class AuthController {
  constructor(private loginUseCase: LoginUseCase) {}

  @Post('sign-in')
  @ApiOperation({
    summary: 'Realiza login do usuário',
    description: 'Autentica o usuário e retorna um token JWT.',
  })
  @ApiBody({
    type: LoginDto,
    examples: {
      example1: {
        summary: 'Credenciais de login válidas',
        value: {
          email: 'usuario@email.com',
          password: 'senha123',
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Login realizado com sucesso',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 'user123',
          email: 'usuario@email.com',
        },
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
  })
  async login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto.email, dto.password);
  }
}
