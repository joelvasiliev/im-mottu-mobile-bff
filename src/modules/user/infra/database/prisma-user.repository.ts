import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/config/prisma';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';
import { UserRepository } from 'src/repositories/prisma/user-repository';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async create(data: CreateUserDto) {
    return this.prisma.user.create({ data });
  }

  async addToFav(user_id: string, character_id: number, cat_id: string) {
    return this.prisma.favoritePairs.create({
      data: {
        user_id,
        character_id,
        cat_id,
      },
    });
  }

  async getFavorites(user_id: string) {
    return await this.prisma.favoritePairs.findMany({
      where: {
        user_id,
      },
    });
  }
}
