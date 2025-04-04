import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { PrismaService } from 'src/config/prisma';
import { User } from '@prisma/client';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findMany(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users;
  }
}
