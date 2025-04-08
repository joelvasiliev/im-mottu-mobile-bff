import { GetRandomCatUseCase } from './get-random-cat.use-case';
import { CatApiRepository } from 'src/repositories/http/cat-api-repository';
import { Cat } from 'src/modules/cats/dto';
import { HttpException } from '@nestjs/common';

describe('GetRandomCatUseCase', () => {
  let useCase: GetRandomCatUseCase;
  let mockCatApiRepository: Partial<CatApiRepository>;

  const validCat: Cat = {
    id: 'abc123',
    url: 'https://cdn2.thecatapi.com/images/abc123.jpg',
    width: 500,
    height: 500,
  };

  beforeEach(() => {
    mockCatApiRepository = {
      getRandomCat: jest.fn(),
    };

    useCase = new GetRandomCatUseCase(mockCatApiRepository as CatApiRepository);
  });

  it('should return a valid cat', async () => {
    (mockCatApiRepository.getRandomCat as jest.Mock).mockResolvedValue(
      validCat,
    );

    const result = await useCase.execute();

    expect(mockCatApiRepository.getRandomCat).toHaveBeenCalled();
    expect(result).toEqual(validCat);
  });

  it('should throw HttpException if cat data is invalid', async () => {
    const invalidCat = {
      id: '',
      url: '',
      width: 0,
      height: 0,
    } as Cat;

    (mockCatApiRepository.getRandomCat as jest.Mock).mockResolvedValue(
      invalidCat,
    );

    await expect(useCase.execute()).rejects.toThrow(HttpException);

    try {
      await useCase.execute();
    } catch (err) {
      expect(err).toBeInstanceOf(HttpException);
      expect(err.getResponse()).toEqual({
        message: 'Os dados do gato retornado são inválidos',
        details: invalidCat,
      });
    }
  });
});
