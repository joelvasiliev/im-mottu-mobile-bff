import { GetFavoritePairsUseCase } from './get-favorites.use-case';
import { PrismaUserRepository } from 'src/modules/user/infra/database/prisma-user.repository';
import { InputGetFavoritePairsDto } from '../../dto/input-get-favorites.dto';

describe('GetFavoritePairsUseCase', () => {
  let getFavoritePairsUseCase: GetFavoritePairsUseCase;
  let mockUserRepository: Partial<PrismaUserRepository>;

  const mockFavorites = [
    { characterId: 1, catId: 'cat1' },
    { characterId: 2, catId: 'cat2' },
    { characterId: 3, catId: 'cat3' },
    { characterId: 4, catId: 'cat4' },
    { characterId: 5, catId: 'cat5' },
    { characterId: 6, catId: 'cat6' },
  ];

  beforeEach(() => {
    mockUserRepository = {
      getFavorites: jest.fn().mockResolvedValue(mockFavorites),
    };

    getFavoritePairsUseCase = new GetFavoritePairsUseCase(
      mockUserRepository as PrismaUserRepository,
    );
  });

  it('should return paginated favorite pairs with meta', async () => {
    const input: InputGetFavoritePairsDto = {
      userId: 'user-123',
      page: 2,
      limit: 2,
    };

    const result = await getFavoritePairsUseCase.execute(input);

    expect(mockUserRepository.getFavorites).toHaveBeenCalledWith('user-123');
    expect(result).toEqual({
      data: mockFavorites.slice(2, 4),
      meta: {
        total: mockFavorites.length,
        page: 2,
        limit: 2,
      },
    });
  });

  it('should return the first page with default pagination', async () => {
    const input: InputGetFavoritePairsDto = {
      userId: 'user-456',
    };

    const result = await getFavoritePairsUseCase.execute(input);

    expect(mockUserRepository.getFavorites).toHaveBeenCalledWith('user-456');
    expect(result).toEqual({
      data: mockFavorites.slice(0, 10),
      meta: {
        total: mockFavorites.length,
        page: 1,
        limit: 10,
      },
    });
  });
});
