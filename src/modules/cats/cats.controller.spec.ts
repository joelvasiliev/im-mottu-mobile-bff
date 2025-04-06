import { Test, TestingModule } from '@nestjs/testing';
import { CatsController } from './cats.controller';
import { CatsService } from './application/use-cases';
import { Cat, CatBreedResponse } from './dto';

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
            getBreeds: jest.fn(),
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

  describe('getRandomCat', () => {
    it('should return a random cat', async () => {
      const mockCat: Cat = {
        id: 'ed8',
        url: 'https://cdn2.thecatapi.com/images/ed8.jpg',
        width: 500,
        height: 500,
      };

      jest.spyOn(service, 'getRandomCat').mockResolvedValue(mockCat);

      const result = await controller.getRandomCat();

      expect(result).toEqual(mockCat);
    });

    it('should throw an error if the service throws an error', async () => {
      jest
        .spyOn(service, 'getRandomCat')
        .mockRejectedValue(new Error('API error'));

      await expect(controller.getRandomCat()).rejects.toThrow('API error');
    });
  });

  describe('getBreeds', () => {
    it('should return list of cat breeds', async () => {
      const mockBreeds: CatBreedResponse[] = [
        { id: 'abys', name: 'Abyssinian' },
        { id: 'beng', name: 'Bengal' },
      ];

      jest.spyOn(service, 'getBreeds').mockResolvedValue(mockBreeds);

      const result = await controller.getBreeds();

      expect(result).toEqual(mockBreeds);
    });

    it('should throw an error if the service throws an error', async () => {
      jest
        .spyOn(service, 'getBreeds')
        .mockRejectedValue(new Error('API error'));

      await expect(controller.getBreeds()).rejects.toThrow('API error');
    });
  });
});
