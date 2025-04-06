import { Test, TestingModule } from '@nestjs/testing';
import { RickandmortyService } from './rickandmorty.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosHeaders, AxiosResponse } from 'axios';
import { Character } from './rickandmorty.dto';
import { ConfigService } from '@nestjs/config';
import { RedisRickAndMortyRepository } from 'src/repositories/cache/redis-rickandmorty-repository';

describe('RickandmortyService', () => {
  let service: RickandmortyService;
  let httpService: HttpService;
  let configService: ConfigService;
  let redisRepo: RedisRickAndMortyRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RickandmortyService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const env = {
                RICKANDMORTY_API_URL:
                  'https://rickandmortyapi.com/api/character/',
              };
              return env[key] as string;
            }),
          },
        },
        {
          provide: RedisRickAndMortyRepository,
          useValue: {
            getCachedCharacter: jest.fn().mockResolvedValue(null),
            setCacheCharacter: jest.fn(),
            getCachedSearch: jest.fn().mockResolvedValue(null),
            setCacheSearch: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<RickandmortyService>(RickandmortyService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
    redisRepo = module.get<RedisRickAndMortyRepository>(
      RedisRickAndMortyRepository,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have environment variables set', () => {
    expect(configService.get('RICKANDMORTY_API_URL')).toBe(
      'https://rickandmortyapi.com/api/character/',
    );
  });

  it('should return a random number between 1 and 826', () => {
    const randomNumber = service.getRandomNumber();
    expect(randomNumber).toBeGreaterThanOrEqual(1);
    expect(randomNumber).toBeLessThanOrEqual(826);
  });

  it('should fetch a random character', async () => {
    const mockCharacter: Character = {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'Earth', url: '' },
      location: { name: 'Citadel of Ricks', url: '' },
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      episode: [],
      url: '',
      created: '',
    };

    const axiosResponse: AxiosResponse<Character> = {
      data: mockCharacter,
      status: 200,
      statusText: 'OK',
      headers: new AxiosHeaders(),
      config: { headers: new AxiosHeaders() },
    };

    jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));

    const result = await service.getRandomCharacter();
    expect(result).toEqual(mockCharacter);
  });

  it('should throw an error when API call fails', async () => {
    jest.spyOn(httpService, 'get').mockImplementation(() => {
      throw new Error('API error');
    });

    await expect(service.getRandomCharacter()).rejects.toThrow(
      'Ocorreu um erro ao buscar dados da RickAndMortyAPI',
    );
  });

  it('should fetch a random character by name', async () => {
    const mockCharacter: Character = {
      id: 1,
      name: 'Rick Sanchez',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'Earth', url: '' },
      location: { name: 'Citadel of Ricks', url: '' },
      image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
      episode: [],
      url: '',
      created: '',
    };

    const mockResponse = {
      info: {
        count: 1,
        pages: 1,
        next: null,
        prev: null,
      },
      results: [mockCharacter],
    };

    const axiosResponse: AxiosResponse<any> = {
      data: mockResponse,
      status: 200,
      statusText: 'OK',
      headers: new AxiosHeaders(),
      config: { headers: new AxiosHeaders() },
    };

    jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));

    const character = await service.getRandomCharacterByName('rick');
    expect(character.name).toBe('Rick Sanchez');
  });

  it('should return character from cache if exists', async () => {
    const cachedCharacter: Character = {
      id: 2,
      name: 'Morty Smith',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Male',
      origin: { name: 'Earth', url: '' },
      location: { name: 'Earth', url: '' },
      image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
      episode: [],
      url: '',
      created: '',
    };

    jest
      .spyOn(redisRepo, 'getCachedCharacter')
      .mockResolvedValueOnce(cachedCharacter);

    const character = await service.getRandomCharacter();
    expect(character).toEqual(cachedCharacter);
  });

  it('should return search result from cache if exists', async () => {
    const cachedSearch: Character = {
      id: 3,
      name: 'Summer Smith',
      status: 'Alive',
      species: 'Human',
      type: '',
      gender: 'Female',
      origin: { name: 'Earth', url: '' },
      location: { name: 'Earth', url: '' },
      image: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
      episode: [],
      url: '',
      created: '',
    };

    jest
      .spyOn(redisRepo, 'getCachedSearch')
      .mockResolvedValueOnce(cachedSearch);

    const character = await service.getRandomCharacterByName('summer');
    expect(character).toEqual(cachedSearch);
  });
});
