import { UserRepository } from 'src/repositories/prisma/user-repository';
import { AddPairToFavoriteUseCase } from './add-pair-to-favorites.use-case';

describe('AddPairToFavoriteUseCase', () => {
  let addPairToFavoriteUseCase: AddPairToFavoriteUseCase;
  let mockUserRepository: Partial<UserRepository>;

  const userId = 'user-123';
  const characterId = 42;
  const catId = 'cat-456';

  beforeEach(() => {
    mockUserRepository = {
      addToFav: jest.fn(),
    };

    addPairToFavoriteUseCase = new AddPairToFavoriteUseCase(
      mockUserRepository as UserRepository,
    );
  });

  it('should call userRepository.addToFav with correct arguments', async () => {
    await addPairToFavoriteUseCase.execute(userId, characterId, catId);

    expect(mockUserRepository.addToFav).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.addToFav).toHaveBeenCalledWith(
      userId,
      characterId,
      catId,
    );
  });
});
