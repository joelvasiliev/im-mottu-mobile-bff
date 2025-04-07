import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRepository } from 'src/repositories/prisma/user-repository';

@Injectable()
export class GetUserByEmailUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(email: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      id: user.id,
      email: user.email,
    };
  }
}
