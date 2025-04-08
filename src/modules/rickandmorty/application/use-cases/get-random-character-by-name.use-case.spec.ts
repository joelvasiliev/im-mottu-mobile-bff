import { GetRandomCharacterByNameUseCase } from './get-random-character-by-name.use-case';
import { RedisRickAndMortyRepository } from 'src/modules/rickandmorty/infra/cache/redis-rickandmorty-repository';
import { RickAndMortyApiRepository } from 'src/repositories/http/rick-and-morty-api-repository';
import { Character } from 'src/modules/rickandmorty/dto';

describe('GetRandomCharacterByNameUseCase', () => {
  let useCase: GetRandomCharacterByNameUseCase;
  let redisRepository: Partial<RedisRickAndMortyRepository>;
  let apiRepository: Partial<RickAndMortyApiRepository>;

  const characterName = 'Rick';

  const mockCharacterResults: Character[] = [
    {
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
    {
      id: 2,
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
    {
      id: 3,
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
  ];

  beforeEach(() => {
    redisRepository = {
      getCachedSearch: jest.fn(),
      setCacheSearch: jest.fn(),
    };

    apiRepository = {
      listCharactersByNamePaginated: jest.fn(),
    };

    useCase = new GetRandomCharacterByNameUseCase(
      redisRepository as RedisRickAndMortyRepository,
      apiRepository as RickAndMortyApiRepository,
    );
  });

  it('should return a character from cache if available', async () => {
    (redisRepository.getCachedSearch as jest.Mock).mockResolvedValue(
      mockCharacterResults,
    );

    const result = await useCase.execute(characterName);

    expect(redisRepository.getCachedSearch).toHaveBeenCalledWith(
      characterName.toLowerCase(),
    );
    expect(apiRepository.listCharactersByNamePaginated).not.toHaveBeenCalled();
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name');
  });

  it('should fetch from API and return a random character when cache is empty', async () => {
    (redisRepository.getCachedSearch as jest.Mock).mockResolvedValue(null);

    (
      apiRepository.listCharactersByNamePaginated as jest.Mock
    ).mockResolvedValueOnce({
      info: { pages: 1 },
      results: mockCharacterResults,
    });

    const result = await useCase.execute(characterName);

    expect(apiRepository.listCharactersByNamePaginated).toHaveBeenCalledWith(
      characterName,
      1,
    );
    expect(redisRepository.setCacheSearch).toHaveBeenCalledWith(
      characterName,
      mockCharacterResults,
    );
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name');
  });

  it('should aggregate results from multiple pages when pages > 1', async () => {
    (redisRepository.getCachedSearch as jest.Mock).mockResolvedValue(null);

    (apiRepository.listCharactersByNamePaginated as jest.Mock)
      .mockResolvedValueOnce({
        info: { pages: 2 },
        results: [mockCharacterResults[0]],
      })
      .mockResolvedValueOnce({
        info: { pages: 2 },
        results: [mockCharacterResults[1], mockCharacterResults[2]],
      });

    const result = await useCase.execute(characterName);

    expect(apiRepository.listCharactersByNamePaginated).toHaveBeenCalledTimes(
      2,
    );
    expect(redisRepository.setCacheSearch).toHaveBeenCalledWith(characterName, [
      mockCharacterResults[0],
      mockCharacterResults[1],
      mockCharacterResults[2],
    ]);
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('name');
  });
});
