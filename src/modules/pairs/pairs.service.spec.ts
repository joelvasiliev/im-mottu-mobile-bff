import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse, AxiosHeaders } from 'axios';
import { PairsService } from './pairs.service';
import { PairsController } from './pairs.controller';
import { Cat } from 'src/modules/cats/cats.dto';
import { Pair } from './pairs.dto';
import { Character } from 'src/modules/rickandmorty/rickandmorty.dto';
import { CatsService } from 'src/modules/cats/cats.service';
import { RickandmortyService } from 'src/modules/rickandmorty/rickandmorty.service';
import { ConfigService } from '@nestjs/config';

describe('PairsService', () => {
  let service: PairsService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PairsController,
        PairsService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const env = {
                RICKANDMORTY_API_URL:
                  'https://rickandmortyapi.com/api/character',
                CAT_API_URL: 'https://api.thecatapi.com/v1/images/search',
              };
              return env[key] as string;
            }),
          },
        },
        {
          provide: CatsService,
          useValue: {
            getRandomCat: jest.fn().mockResolvedValue({
              id: 'ed8',
              url: 'https://cdn2.thecatapi.com/images/ed8.jpg',
              width: 500,
              height: 500,
            }),
          },
        },
        {
          provide: RickandmortyService,
          useValue: {
            getRandomCharacter: jest.fn().mockResolvedValue({
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
            }),
          },
        },
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PairsService>(PairsService);
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
    expect(configService.get('CAT_API_URL')).toBe(
      'https://api.thecatapi.com/v1/images/search',
    );
  });

  it('should return a character and a cat', async () => {
    const mockCat: Cat = {
      id: 'ed8',
      url: 'https://cdn2.thecatapi.com/images/ed8.jpg',
      width: 500,
      height: 500,
    };

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

    const axiosResponse: AxiosResponse<Pair> = {
      data: {
        character: mockCharacter,
        cat: mockCat,
      },
      status: 200,
      statusText: 'OK',
      headers: new AxiosHeaders(),
      config: { headers: new AxiosHeaders() },
    };

    jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));

    const result = await service.execute();
    expect(result).toEqual({
      cat: mockCat,
      character: mockCharacter,
    });
  });

  it('should throw an error when API call fails', async () => {
    jest
      .spyOn(service['catsService'], 'getRandomCat')
      .mockRejectedValue(new Error('API error'));

    await expect(service.execute()).rejects.toThrow(
      'Ocorreu um erro ao relacionar gato com personagem',
    );
  });
});
