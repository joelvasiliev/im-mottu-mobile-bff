import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { PrismaService } from 'src/config/prisma';
import { HttpModule } from '@nestjs/axios';
import { PrismaUserRepository } from './infra/database/prisma-user.repository';
import { UserRepository } from 'src/repositories/prisma/user-repository';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUserByEmailUseCase } from './application/use-cases/get-user-by-email.use-case';
import { JwtServiceUseCase } from '../auth/application/use-cases/jwt-service.use-case';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({}),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: '1d',
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [
    PrismaService,
    JwtServiceUseCase,
    CreateUserUseCase,
    PrismaUserRepository,
    GetUserByEmailUseCase,
    {
      provide: UserRepository,
      useClass: PrismaUserRepository,
    },
  ],
  exports: [CreateUserUseCase, GetUserByEmailUseCase, UserRepository],
})
export class UserModule {}
