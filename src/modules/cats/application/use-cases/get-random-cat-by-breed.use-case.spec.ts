import { GetRandomCatByBreedUseCase } from './get-random-cat-by-breed.use-case';
import { RedisCatRepository } from 'src/modules/cats/infra/cache/redis-cat-repository';
import { CatApiRepository } from 'src/repositories/http/cat-api-repository';
import { ListBreedsUseCase } from './list-breeds.use-case';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Cat } from 'src/modules/cats/dto/cat.dto';
import { CatBreedResponse } from '../../dto';

describe('GetRandomCatByBreedUseCase', () => {
  let useCase: GetRandomCatByBreedUseCase;
  let mockRedisCatRepository: Partial<RedisCatRepository>;
  let mockCatApiRepository: Partial<CatApiRepository>;
  let mockListBreedsUseCase: Partial<ListBreedsUseCase>;

  const mockCat: Cat = {
    id: 'ed8',
    url: 'https://cdn2.thecatapi.com/images/ed8.jpg',
    width: 500,
    height: 500,
  };

  const mockBreeds: CatBreedResponse[] = [{ id: 'abys', name: 'Abyssinian' }];

  beforeEach(() => {
    mockRedisCatRepository = {
      getCachedBreeds: jest.fn(),
    };

    mockCatApiRepository = {
      getRandomCatByBreed: jest.fn(),
    };

    mockListBreedsUseCase = {
      execute: jest.fn(),
    };

    useCase = new GetRandomCatByBreedUseCase(
      mockCatApiRepository as CatApiRepository,
      mockRedisCatRepository as RedisCatRepository,
      mockListBreedsUseCase as ListBreedsUseCase,
    );
  });

  it('should return a cat when breed is valid and cached', async () => {
    (mockRedisCatRepository.getCachedBreeds as jest.Mock).mockResolvedValue(
      mockBreeds,
    );
    (mockCatApiRepository.getRandomCatByBreed as jest.Mock).mockResolvedValue(
      mockCat,
    );

    const result = await useCase.execute('abys');

    expect(mockRedisCatRepository.getCachedBreeds).toHaveBeenCalled();
    expect(mockCatApiRepository.getRandomCatByBreed).toHaveBeenCalledWith(
      'abys',
    );
    expect(result).toEqual(mockCat);
  });

  it('should call listBreedsUseCase if cache is empty', async () => {
    (mockRedisCatRepository.getCachedBreeds as jest.Mock).mockResolvedValue(
      null,
    );
    (mockListBreedsUseCase.execute as jest.Mock).mockResolvedValue(mockBreeds);
    (mockCatApiRepository.getRandomCatByBreed as jest.Mock).mockResolvedValue(
      mockCat,
    );

    const result = await useCase.execute('abys');

    expect(mockListBreedsUseCase.execute).toHaveBeenCalled();
    expect(mockCatApiRepository.getRandomCatByBreed).toHaveBeenCalledWith(
      'abys',
    );
    expect(result).toEqual(mockCat);
  });

  it('should throw HttpException if breed is not found', async () => {
    (mockRedisCatRepository.getCachedBreeds as jest.Mock).mockResolvedValue(
      mockBreeds,
    );

    await expect(useCase.execute('invalid-breed')).rejects.toThrow(
      new HttpException(
        {
          message:
            'Raça inválida. Para ver as raças disponíveis utilize a rota GET - cats/breeds',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      ),
    );

    expect(mockCatApiRepository.getRandomCatByBreed).not.toHaveBeenCalled();
  });
});
