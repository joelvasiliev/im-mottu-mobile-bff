import { PairsController } from './pairs.controller';
import { GetPairUseCase } from './application/use-cases/get-pair.use-case';
import { GetFavoritePairsUseCase } from './application/use-cases/get-favorites.use-case';
import { AddPairToFavoriteUseCase } from './application/use-cases/add-pair-to-favorites.use-case';
import { Pair } from './dto/pair.dto';
import { AddFavoriteDto } from './dto/add-to-favorite.dto';

describe('PairsController', () => {
  let controller: PairsController;
  let mockGetPairUseCase: Partial<GetPairUseCase>;
  let mockGetFavoritePairsUseCase: Partial<GetFavoritePairsUseCase>;
  let mockAddPairToFavoriteUseCase: Partial<AddPairToFavoriteUseCase>;

  const mockPair: Pair = {
    character: {
      id: 1,
      name: 'Rick Sanchez',
      image: 'rick.png',
      status: 'Alive',
      species: 'Human',
      gender: 'Male',
      origin: { name: 'Earth', url: 'https://example.com' },
      location: { name: 'Citadel of Ricks', url: 'https://example.com' },
      created: new Date(Date.now()).toISOString(),
      episode: ['1'],
      type: '',
      url: 'https://example.com',
    },
    cat: {
      id: 'cat-123',
      url: 'https://cdn2.thecatapi.com/images/cat-123.jpg',
      width: 500,
      height: 500,
    },
  };

  const mockFavorites = {
    data: [mockPair],
    total: 1,
    page: 1,
    limit: 10,
  };

  beforeEach(() => {
    mockGetPairUseCase = {
      execute: jest.fn().mockResolvedValue(mockPair),
    };

    mockGetFavoritePairsUseCase = {
      execute: jest.fn().mockResolvedValue(mockFavorites),
    };

    mockAddPairToFavoriteUseCase = {
      execute: jest.fn().mockResolvedValue({ success: true }),
    };

    controller = new PairsController(
      mockGetPairUseCase as GetPairUseCase,
      mockGetFavoritePairsUseCase as GetFavoritePairsUseCase,
      mockAddPairToFavoriteUseCase as AddPairToFavoriteUseCase,
    );
  });

  it('should return a character-cat pair', async () => {
    const result = await controller.get('Rick', 'Abyssinian');

    expect(mockGetPairUseCase.execute).toHaveBeenCalledWith(
      'Rick',
      'Abyssinian',
    );
    expect(result).toEqual(mockPair);
  });

  it('should return favorite pairs with user info', async () => {
    const req = { user: { sub: 'user-123' } };
    const result = await controller.getFavorites(req, 1, 10);

    expect(mockGetFavoritePairsUseCase.execute).toHaveBeenCalledWith({
      userId: 'user-123',
      page: 1,
      limit: 10,
    });
    expect(result).toEqual(mockFavorites);
  });

  it('should add a favorite pair', async () => {
    const req = { user: { sub: 'user-123' } };
    const body: AddFavoriteDto = {
      character_id: 1,
      cat_id: 'cat-123',
    };

    const result = await controller.addFavorite(body, req);

    expect(mockAddPairToFavoriteUseCase.execute).toHaveBeenCalledWith(
      'user-123',
      1,
      'cat-123',
    );
    expect(result).toEqual({ success: true });
  });
});
