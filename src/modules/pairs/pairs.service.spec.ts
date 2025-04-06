import { Test, TestingModule } from '@nestjs/testing';
import { PairsService } from './application/use-cases/get-pair.use-case';
import { Cat } from 'src/modules/cats/dto/cat.dto';
import { Character } from 'src/modules/rickandmorty/dto/character.dto';
import { CatsService } from 'src/modules/cats/application/use-cases';
import { RickandmortyService } from 'src/modules/rickandmorty/application/use-cases/rickandmorty.service';
import { ConfigService } from '@nestjs/config';

describe('PairsService', () => {
  let service: PairsService;
  let configService: ConfigService;

  let getRandomCatMock: jest.Mock;
  let getRandomCatByBreedMock: jest.Mock;
  let getRandomCharacterMock: jest.Mock;
  let getRandomCharacterByNameMock: jest.Mock;

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

  beforeEach(async () => {
    getRandomCatMock = jest.fn().mockResolvedValue(mockCat);
    getRandomCatByBreedMock = jest.fn().mockResolvedValue(mockCat);
    getRandomCharacterMock = jest.fn().mockResolvedValue(mockCharacter);
    getRandomCharacterByNameMock = jest.fn().mockResolvedValue(mockCharacter);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
            getRandomCat: getRandomCatMock,
            getRandomCatByBreed: getRandomCatByBreedMock,
          },
        },
        {
          provide: RickandmortyService,
          useValue: {
            getRandomCharacter: getRandomCharacterMock,
            getRandomCharacterByName: getRandomCharacterByNameMock,
          },
        },
      ],
    }).compile();

    service = module.get<PairsService>(PairsService);
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
    const result = await service.execute();

    expect(getRandomCatMock).toHaveBeenCalled();
    expect(getRandomCharacterMock).toHaveBeenCalled();

    expect(result).toEqual({
      cat: mockCat,
      character: mockCharacter,
    });
  });

  it('should return a specific cat by breed and character by name', async () => {
    const result = await service.execute('Rick', 'siamese');

    expect(getRandomCatByBreedMock).toHaveBeenCalledWith('siamese');
    expect(getRandomCharacterByNameMock).toHaveBeenCalledWith('Rick');

    expect(result).toEqual({
      cat: mockCat,
      character: mockCharacter,
    });
  });

  it('should throw an error when cat API fails', async () => {
    getRandomCatMock.mockRejectedValueOnce(new Error('API error'));

    await expect(service.execute()).rejects.toThrow('API error');
  });

  it('should throw an error when character API fails', async () => {
    getRandomCharacterMock.mockRejectedValueOnce(
      new Error('Character API error'),
    );

    await expect(service.execute()).rejects.toThrow('Character API error');
  });
});
