import { CatsController } from './cats.controller';
import { GetRandomCatUseCase } from './application/use-cases/get-random-cat.use-case';
import { ListBreedsUseCase } from './application/use-cases/list-breeds.use-case';
import { Cat, CatBreedResponse } from './dto';

describe('CatsController', () => {
  let controller: CatsController;
  let mockGetRandomCatUseCase: Partial<GetRandomCatUseCase>;
  let mockListBreedsUseCase: Partial<ListBreedsUseCase>;

  const mockCat: Cat = {
    id: 'cat-123',
    url: 'https://cdn2.thecatapi.com/images/cat-123.jpg',
    width: 500,
    height: 500,
  };

  const mockBreeds: CatBreedResponse[] = [
    { id: 'abys', name: 'Abyssinian' },
    { id: 'aege', name: 'Aegean' },
  ];

  beforeEach(() => {
    mockGetRandomCatUseCase = {
      execute: jest.fn().mockResolvedValue(mockCat),
    };

    mockListBreedsUseCase = {
      execute: jest.fn().mockResolvedValue(mockBreeds),
    };

    controller = new CatsController(
      mockGetRandomCatUseCase as GetRandomCatUseCase,
      mockListBreedsUseCase as ListBreedsUseCase,
    );
  });

  it('should return a random cat', async () => {
    const result = await controller.getRandomCat();

    expect(mockGetRandomCatUseCase.execute).toHaveBeenCalled();
    expect(result).toEqual(mockCat);
  });

  it('should return list of cat breeds', async () => {
    const result = await controller.getBreeds();

    expect(mockListBreedsUseCase.execute).toHaveBeenCalled();
    expect(result).toEqual(mockBreeds);
  });
});
