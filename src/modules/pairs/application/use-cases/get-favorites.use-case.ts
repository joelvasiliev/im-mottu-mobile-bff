import { Injectable } from '@nestjs/common';
import { InputGetFavoritePairsDto } from '../../dto/input-get-favorites.dto';
import { PrismaUserRepository } from 'src/modules/user/infra/database/prisma-user.repository';

@Injectable()
export class GetFavoritePairsUseCase {
  constructor(private readonly userRepository: PrismaUserRepository) {}

  async execute({ userId, page = 1, limit = 10 }: InputGetFavoritePairsDto) {
    const skip = (page - 1) * limit;

    const favorites = await this.userRepository.getFavorites(userId);

    return {
      data: favorites.slice(skip, skip + limit),
      meta: {
        total: favorites.length,
        page,
        limit,
      },
    };
  }
}
