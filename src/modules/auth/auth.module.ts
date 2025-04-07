import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { PrismaUserRepository } from '../user/infra/database/prisma-user.repository';
import { JwtServiceUseCase } from './application/use-cases/jwt-service.use-case';
import { UserModule } from '../user/user.module';
import { PrismaService } from 'src/config/prisma';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dbb1f171-7b8d-49c9-a8e6-59e58dbac5b7',
      signOptions: { expiresIn: '1d' },
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    JwtService,
    JwtServiceUseCase,
    PrismaUserRepository,
    JwtServiceUseCase,
    PrismaService,
  ],
  exports: [JwtService, JwtServiceUseCase],
})
export class AuthModule {}
