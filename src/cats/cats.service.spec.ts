import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of } from 'rxjs';
import { AxiosResponse, AxiosHeaders } from 'axios';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { Cat } from './cats.dto';

describe('CatService', () => {
  let service: CatsService;
  let httpService: HttpService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CatsController,
        CatsService,
        {
          provide: HttpService,
          useValue: {
            get: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string): string => {
              const env: Record<string, string> = {
                CAT_API_URL: 'https://api.thecatapi.com/v1/images/search',
              };
              return env[key];
            }),
          },
        },
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
    httpService = module.get<HttpService>(HttpService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should have environment variables set', () => {
    expect(configService.get('CAT_API_URL')).toBe(
      'https://api.thecatapi.com/v1/images/search',
    );
  });

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

    jest.spyOn(httpService, 'get').mockReturnValue(of(axiosResponse));

    const result = await service.getRandomCat();
    expect(result).toEqual(mockCat);
  });

  it('should throw an error when API call fails', async () => {
    jest.spyOn(httpService, 'get').mockImplementation(() => {
      throw new Error('API error');
    });

    await expect(service.getRandomCat()).rejects.toThrow(
      'Ocorreu um erro ao buscar dados da TheCatAPI',
    );
  });
});
