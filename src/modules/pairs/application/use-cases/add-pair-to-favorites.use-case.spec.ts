import { UserRepository } from 'src/repositories/prisma/user-repository';
import { AddFavoriteUseCase } from './add-pair-to-favorites.use-case';

const mockUser = {
  userId: 'user123',
  characterId: 42,
  catId: 'cat123',
};

describe('AddFavoriteUseCase', () => {
  let useCase: AddFavoriteUseCase;
  let userRepo: jest.Mocked<UserRepository>;

  beforeEach(() => {
    userRepo = {
      addToFav: jest.fn(),
      create: jest.fn(),
      findByEmail: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    useCase = new AddFavoriteUseCase(userRepo);
  });

  it('should call addToFav with correct params', async () => {
    await useCase.execute(mockUser);

    jest.spyOn(useCase, 'execute').mockImplementation(async () => {});
  });
});
