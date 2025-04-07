import { Body, Controller, Post } from '@nestjs/common';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { LoginDto } from './dto/login.dto';

@Controller('v1/auth')
export class AuthController {
  constructor(private loginUseCase: LoginUseCase) {}

  @Post('sign-in')
  async login(@Body() dto: LoginDto) {
    return this.loginUseCase.execute(dto.email, dto.password);
  }
}
