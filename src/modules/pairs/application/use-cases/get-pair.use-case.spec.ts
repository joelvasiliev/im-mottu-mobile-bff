import { GetPairUseCase } from './get-pair.use-case';
import { GetRandomCatUseCase } from 'src/modules/cats/application/use-cases/get-random-cat.use-case';
import { GetRandomCatByBreedUseCase } from 'src/modules/cats/application/use-cases/get-random-cat-by-breed.use-case';
import { GetRandomCharacterUseCase } from 'src/modules/rickandmorty/application/use-cases/get-random-character.use-case';
import { GetRandomCharacterByNameUseCase } from 'src/modules/rickandmorty/application/use-cases/get-random-character-by-name.use-case';

describe('GetPairUseCase', () => {
  let getPairUseCase: GetPairUseCase;
  let getRandomCatUseCase: Partial<GetRandomCatUseCase>;
  let getRandomCatByBreedUseCase: Partial<GetRandomCatByBreedUseCase>;
  let getRandomCharacterUseCase: Partial<GetRandomCharacterUseCase>;
  let getRandomCharacterByNameUseCase: Partial<GetRandomCharacterByNameUseCase>;

  const mockCat = { id: 'cat1', breed: 'Siamese' };
  const mockCharacter = { id: 1, name: 'Rick Sanchez' };

  beforeEach(() => {
    getRandomCatUseCase = {
      execute: jest.fn().mockResolvedValue(mockCat),
    };

    getRandomCatByBreedUseCase = {
      execute: jest.fn().mockResolvedValue(mockCat),
    };

    getRandomCharacterUseCase = {
      execute: jest.fn().mockResolvedValue(mockCharacter),
    };

    getRandomCharacterByNameUseCase = {
      execute: jest.fn().mockResolvedValue(mockCharacter),
    };

    getPairUseCase = new GetPairUseCase(
      getRandomCatUseCase as GetRandomCatUseCase,
      getRandomCatByBreedUseCase as GetRandomCatByBreedUseCase,
      getRandomCharacterUseCase as GetRandomCharacterUseCase,
      getRandomCharacterByNameUseCase as GetRandomCharacterByNameUseCase,
    );
  });

  it('should return a pair using default character and cat', async () => {
    const result = await getPairUseCase.execute();

    expect(getRandomCatUseCase.execute).toHaveBeenCalled();
    expect(getRandomCharacterUseCase.execute).toHaveBeenCalled();
    expect(result).toEqual({ character: mockCharacter, cat: mockCat });
  });

  it('should return a pair with specific cat breed', async () => {
    const result = await getPairUseCase.execute(undefined, 'Siamese');

    expect(getRandomCatByBreedUseCase.execute).toHaveBeenCalledWith('Siamese');
    expect(getRandomCharacterUseCase.execute).toHaveBeenCalled();
    expect(result).toEqual({ character: mockCharacter, cat: mockCat });
  });

  it('should return a pair with specific character name', async () => {
    const result = await getPairUseCase.execute('Rick', undefined);

    expect(getRandomCatUseCase.execute).toHaveBeenCalled();
    expect(getRandomCharacterByNameUseCase.execute).toHaveBeenCalledWith(
      'Rick',
    );
    expect(result).toEqual({ character: mockCharacter, cat: mockCat });
  });

  it('should return a pair with specific character name and cat breed', async () => {
    const result = await getPairUseCase.execute('Morty', 'Persian');

    expect(getRandomCatByBreedUseCase.execute).toHaveBeenCalledWith('Persian');
    expect(getRandomCharacterByNameUseCase.execute).toHaveBeenCalledWith(
      'Morty',
    );
    expect(result).toEqual({ character: mockCharacter, cat: mockCat });
  });
});
