import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';
import { Cat } from './cats.dto';

describe('CatsController', () => {
  let controller: CatsController;
  let service: CatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CatsController],
      providers: [
        {
          provide: CatsService,
          useValue: {
            getRandomCat: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CatsController>(CatsController);
    service = module.get<CatsService>(CatsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get', () => {
    it('should return an array of Cat objects', async () => {
      const mockCat: Cat[] = [
        {
          id: 'ed8',
          url: 'https://cdn2.thecatapi.com/images/ed8.jpg',
          width: 500,
          height: 500,
        },
      ];

      jest.spyOn(service, 'getRandomCat').mockResolvedValue(mockCat);

      const result = await controller.get();

      expect(result).toEqual(mockCat);
    });

    it('should throw an error if the service throws an error', async () => {
      jest
        .spyOn(service, 'getRandomCat')
        .mockRejectedValue(new Error('API error'));

      await expect(controller.get()).rejects.toThrow('API error');
    });
  });
});
