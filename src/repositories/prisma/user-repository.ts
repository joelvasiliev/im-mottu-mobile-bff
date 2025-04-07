import { FavoritePairs, User } from '@prisma/client';
import { CreateUserDto } from 'src/modules/user/dto/create-user.dto';

export abstract class UserRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract getFavorites(user_id: string): Promise<FavoritePairs[]>;
  abstract create(data: CreateUserDto): Promise<User>;
  abstract addToFav(
    user_id: string,
    character_id: number,
    cat_id: string,
  ): Promise<FavoritePairs>;
}
