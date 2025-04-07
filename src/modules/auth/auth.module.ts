import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { PrismaUserRepository } from '../user/infra/database/prisma-user.repository';
import { JwtServiceUseCase } from './application/use-cases/jwt-service.use-case';
import { UserModule } from '../user/user.module';
import { PrismaService } from 'src/config/prisma';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'fallback-secret',
        signOptions: { expiresIn: '1d' },
      }),
    }),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtStrategy,
    LoginUseCase,
    JwtServiceUseCase,
    PrismaUserRepository,
    PrismaService,
  ],
  exports: [JwtModule, JwtServiceUseCase],
})
export class AuthModule {}
