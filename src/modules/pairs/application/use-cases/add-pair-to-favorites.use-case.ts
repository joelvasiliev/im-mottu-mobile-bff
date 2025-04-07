import { Injectable } from '@nestjs/common';
import { UserRepository } from 'src/repositories/prisma/user-repository';

@Injectable()
export class AddPairToFavoriteUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(user_id: string, character_id: number, cat_id: string) {
    await this.userRepository.addToFav(user_id, character_id, cat_id);
  }
}
