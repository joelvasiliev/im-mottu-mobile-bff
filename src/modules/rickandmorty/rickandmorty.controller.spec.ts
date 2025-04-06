import { Test, TestingModule } from '@nestjs/testing';
import { RickandmortyController } from './rickandmorty.controller';
import { RickandmortyService } from './application/use-cases/rickandmorty.service';

describe('RickandmortyController', () => {
  let controller: RickandmortyController;
  let service: RickandmortyService;

  beforeEach(async () => {
    const mockService = {
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
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RickandmortyController],
      providers: [{ provide: RickandmortyService, useValue: mockService }],
    }).compile();

    controller = module.get<RickandmortyController>(RickandmortyController);
    service = module.get<RickandmortyService>(RickandmortyService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a random character', async () => {
    const result = await controller.get();

    expect(result).toHaveProperty('id', 1);
    expect(result).toHaveProperty('name', 'Rick Sanchez');
  });

  it('should handle errors from the service', async () => {
    jest
      .spyOn(service, 'getRandomCharacter')
      .mockRejectedValue(new Error('API error'));

    await expect(controller.get()).rejects.toThrow('API error');
  });
});
