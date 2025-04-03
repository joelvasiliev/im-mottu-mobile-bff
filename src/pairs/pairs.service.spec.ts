import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse, AxiosHeaders } from 'axios';
import { PairsService } from './pairs.service';
import { PairsController } from './pairs.controller';
import { Cat } from 'src/cats/cats.dto';
import { Pair } from './pairs.dto';
import { Character } from 'src/rickandmorty/rickandmorty.dto';
import { CatsService } from 'src/cats/cats.service';
import { RickandmortyService } from 'src/rickandmorty/rickandmorty.service';

describe('PairsService', () => {
  let service: PairsService;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PairsController,
        PairsService,
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
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
