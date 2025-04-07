import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { AxiosResponse, AxiosHeaders } from 'axios';
import { CatsService } from './application/use-cases';
import { Cat, CatBreedResponse } from './dto';
import { RedisCatRepository } from 'src/modules/cats/infra/cache/redis-cat-repository';

describe('CatsService', () => {
  let service: CatsService;

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      if (key === 'CAT_API_URL') return 'https://api.thecatapi.com/v1/';
      return '';
    }),
  };

  const mockRedisCatRepository = {
    getCachedBreeds: jest.fn(),
    setCacheBreeds: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsService,
        { provide: HttpService, useValue: mockHttpService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: RedisCatRepository, useValue: mockRedisCatRepository },
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getRandomCat', () => {
    it('should fetch a random cat', async () => {
      const mockCat: Cat = {
        id: 'ed8',
        url: 'https://cdn2.thecatapi.com/images/ed8.jpg',
        width: 500,
        height: 500,
      };

      const axiosResponse: AxiosResponse<Cat[]> = {
        data: [mockCat],
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
      };

      mockHttpService.get.mockReturnValue(of(axiosResponse));

      const result = await service.getRandomCat();
      expect(result).toEqual(mockCat);
    });

    it('should throw error when API call fails', async () => {
      mockHttpService.get.mockImplementation(() => {
        return throwError(() => new Error('API error'));
      });

      await expect(service.getRandomCat()).rejects.toThrow(
        'Ocorreu um erro ao buscar dados da TheCatAPI',
      );
    });
  });

  describe('getBreeds', () => {
    it('should return cached breeds if available', async () => {
      const cached: CatBreedResponse[] = [{ id: 'beng', name: 'Bengal' }];
      mockRedisCatRepository.getCachedBreeds.mockResolvedValue(cached);

      const result = await service.getBreeds();
      expect(result).toEqual(cached);
    });

    it('should fetch breeds and cache them if not cached', async () => {
      mockRedisCatRepository.getCachedBreeds.mockResolvedValue(null);

      const mockBreeds: CatBreedResponse[] = [
        { id: 'abys', name: 'Abyssinian' },
        { id: 'beng', name: 'Bengal' },
      ];

      const axiosResponse: AxiosResponse<CatBreedResponse[]> = {
        data: mockBreeds,
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
      };

      mockHttpService.get.mockReturnValue(of(axiosResponse));

      const result = await service.getBreeds();
      expect(result).toEqual([
        { id: 'abys', name: 'Abyssinian' },
        { id: 'beng', name: 'Bengal' },
      ]);

      expect(mockRedisCatRepository.setCacheBreeds).toHaveBeenCalledWith([
        { id: 'abys', name: 'Abyssinian' },
        { id: 'beng', name: 'Bengal' },
      ]);
    });
  });

  describe('getRandomCatByBreed', () => {
    it('should return a cat by breed if breed is valid', async () => {
      const breed = 'beng';

      const cachedBreeds: CatBreedResponse[] = [{ id: 'beng', name: 'Bengal' }];

      const mockCat: Cat = {
        id: '123',
        url: 'http://cat.jpg',
        width: 300,
        height: 300,
      };

      const axiosResponse: AxiosResponse<Cat[]> = {
        data: [mockCat],
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
      };

      mockRedisCatRepository.getCachedBreeds.mockResolvedValue(cachedBreeds);
      mockHttpService.get.mockReturnValue(of(axiosResponse));

      const result = await service.getRandomCatByBreed(breed);
      expect(result).toEqual(mockCat);
    });

    it('should throw if breed is invalid', async () => {
      mockRedisCatRepository.getCachedBreeds.mockResolvedValue([
        { id: 'abys', name: 'Abyssinian' },
      ]);

      await expect(service.getRandomCatByBreed('invalid')).rejects.toThrowError(
        'Raça inválida',
      );
    });

    it('should fetch breeds from API if not cached', async () => {
      mockRedisCatRepository.getCachedBreeds.mockResolvedValue(null);

      const apiBreeds: CatBreedResponse[] = [
        { id: 'abys', name: 'Abyssinian' },
        { id: 'beng', name: 'Bengal' },
      ];

      const axiosBreedsResponse: AxiosResponse<CatBreedResponse[]> = {
        data: apiBreeds,
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
      };

      const mockCat: Cat = {
        id: '456',
        url: 'http://cat.jpg',
        width: 200,
        height: 200,
      };

      const axiosCatResponse: AxiosResponse<Cat[]> = {
        data: [mockCat],
        status: 200,
        statusText: 'OK',
        headers: new AxiosHeaders(),
        config: { headers: new AxiosHeaders() },
      };

      mockHttpService.get
        .mockReturnValueOnce(of(axiosBreedsResponse))
        .mockReturnValueOnce(of(axiosCatResponse));

      const result = await service.getRandomCatByBreed('beng');
      expect(result).toEqual(mockCat);
    });
  });
});
