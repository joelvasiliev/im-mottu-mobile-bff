import { Test, TestingModule } from '@nestjs/testing';
import { RickandmortyService } from './rickandmorty.service';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse, AxiosHeaders } from 'axios';
import { Character } from './rickandmorty.dto';
import { RickandmortyController } from './rickandmorty.controller';
import { ConfigService } from '@nestjs/config';

describe('RickandmortyService', () => {
  let service: RickandmortyService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RickandmortyController,
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
                  'https://rickandmortyapi.com/api/character',
              };
              return env[key] as string;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<RickandmortyService>(RickandmortyService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have environment variables set', () => {
    expect(configService.get('RICKANDMORTY_API_URL')).toBe(
      'https://rickandmortyapi.com/api/character',
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
});
