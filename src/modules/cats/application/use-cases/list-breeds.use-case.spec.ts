import { ListBreedsUseCase } from './list-breeds.use-case';
import { CatApiRepository } from 'src/repositories/http/cat-api-repository';

describe('ListBreedsUseCase', () => {
  let useCase: ListBreedsUseCase;
  let mockCatApiRepository: Partial<CatApiRepository>;

  const mockBreeds = [
    { id: 'abys', name: 'Abyssinian', origin: 'Egypt', temperament: 'Active' },
    {
      id: 'aege',
      name: 'Aegean',
      origin: 'Greece',
      temperament: 'Affectionate',
    },
  ];

  beforeEach(() => {
    mockCatApiRepository = {
      listBreeds: jest.fn().mockResolvedValue(mockBreeds),
    };

    useCase = new ListBreedsUseCase(mockCatApiRepository as CatApiRepository);
  });

  it('should return an array of filtered CatBreedResponse (id and name only)', async () => {
    const result = await useCase.execute();

    expect(mockCatApiRepository.listBreeds).toHaveBeenCalled();
    expect(result).toEqual([
      { id: 'abys', name: 'Abyssinian' },
      { id: 'aege', name: 'Aegean' },
    ]);
  });

  it('should return an empty array if API returns no breeds', async () => {
    (mockCatApiRepository.listBreeds as jest.Mock).mockResolvedValue([]);

    const result = await useCase.execute();

    expect(mockCatApiRepository.listBreeds).toHaveBeenCalled();
    expect(result).toEqual([]);
  });
});
