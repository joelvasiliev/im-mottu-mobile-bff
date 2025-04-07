import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtServiceUseCase } from './jwt-service.use-case';
import { UserRepository } from 'src/repositories/prisma/user-repository';

@Injectable()
export class LoginUseCase {
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtServiceUseCase,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    return {
      access_token: token,
    };
  }
}
