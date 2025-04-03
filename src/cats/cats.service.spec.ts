import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosResponse, AxiosHeaders } from 'axios';
import { CatsService } from './cats.service';
import { CatsController } from './cats.controller';
import { Cat } from './cats.dto';

describe('CatService', () => {
  let service: CatsService;
  let httpService: HttpService;

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
      ],
    }).compile();

    service = module.get<CatsService>(CatsService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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
