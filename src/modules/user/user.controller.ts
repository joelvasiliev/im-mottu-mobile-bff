import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUserByEmailUseCase } from './application/use-cases/get-user-by-email.use-case';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth-guard';

@ApiTags('Users')
@Controller('v1/user')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getUserByEmailUseCase: GetUserByEmailUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Criar novo usuário',
    description: 'Cria um novo usuário com e-mail e senha.',
  })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      example1: {
        summary: 'Cadastro válido',
        value: {
          email: 'usuario@email.com',
          password: 'senhaSegura123',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    schema: {
      example: {
        id: 'user-id-abc123',
        email: 'usuario@email.com',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'E-mail já está em uso',
  })
  async create(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Buscar usuário autenticado',
    description:
      'Retorna os dados do usuário autenticado com base no token JWT.',
  })
  @ApiResponse({
    status: 200,
    description: 'Usuário encontrado',
    schema: {
      example: {
        id: 'user-id-abc123',
        email: 'usuario@email.com',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Token JWT inválido ou ausente',
  })
  @ApiResponse({
    status: 404,
    description: 'Usuário não encontrado',
  })
  async getByEmail(@Req() req) {
    return this.getUserByEmailUseCase.execute(req.user.email as string);
  }
}
