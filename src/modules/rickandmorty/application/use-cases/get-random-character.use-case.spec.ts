import { GetRandomCharacterUseCase } from './get-random-character.use-case';
import { RedisRickAndMortyRepository } from 'src/modules/rickandmorty/infra/cache/redis-rickandmorty-repository';
import { RickAndMortyApiRepository } from 'src/repositories/http/rick-and-morty-api-repository';
import { Character } from 'src/modules/rickandmorty/dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('GetRandomCharacterUseCase', () => {
  let useCase: GetRandomCharacterUseCase;
  let redisRepository: Partial<RedisRickAndMortyRepository>;
  let apiRepository: Partial<RickAndMortyApiRepository>;

  const mockCharacter: Character = {
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
  };

  beforeEach(() => {
    redisRepository = {
      getCachedCharacter: jest.fn(),
    };

    apiRepository = {
      getCharacterById: jest.fn(),
    };

    useCase = new GetRandomCharacterUseCase(
      redisRepository as RedisRickAndMortyRepository,
      apiRepository as RickAndMortyApiRepository,
    );
  });

  it('should return a character from cache if available', async () => {
    (redisRepository.getCachedCharacter as jest.Mock).mockResolvedValue(
      mockCharacter,
    );

    const result = await useCase.execute();

    expect(redisRepository.getCachedCharacter).toHaveBeenCalled();
    expect(apiRepository.getCharacterById).not.toHaveBeenCalled();
    expect(result).toEqual(mockCharacter);
  });

  it('should return a character from API if not in cache', async () => {
    (redisRepository.getCachedCharacter as jest.Mock).mockResolvedValue(null);
    (apiRepository.getCharacterById as jest.Mock).mockResolvedValue(
      mockCharacter,
    );

    const result = await useCase.execute();

    expect(redisRepository.getCachedCharacter).toHaveBeenCalled();
    expect(apiRepository.getCharacterById).toHaveBeenCalled();
    expect(result).toEqual(mockCharacter);
  });

  it('should throw an exception if character returned is invalid', async () => {
    const invalidCharacter = {
      id: null,
      name: '',
      image: '',
    };

    (redisRepository.getCachedCharacter as jest.Mock).mockResolvedValue(null);
    (apiRepository.getCharacterById as jest.Mock).mockResolvedValue(
      invalidCharacter,
    );

    await expect(useCase.execute()).rejects.toThrow(HttpException);
    await expect(useCase.execute()).rejects.toMatchObject({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    });

    expect(redisRepository.getCachedCharacter).toHaveBeenCalled();
    expect(apiRepository.getCharacterById).toHaveBeenCalled();
  });
});
