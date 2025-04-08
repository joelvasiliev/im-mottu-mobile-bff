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
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async create(@Body() dto: CreateUserDto) {
    return this.createUserUseCase.execute(dto);
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get me (authenticated)' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    schema: {
      example: {
        id: 'user-id-123',
        email: 'joel@example.com',
      },
    },
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getByEmail(@Req() req) {
    return this.getUserByEmailUseCase.execute(req.user.email as string);
  }
}
