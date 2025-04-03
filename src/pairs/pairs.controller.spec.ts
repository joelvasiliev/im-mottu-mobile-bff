import { Test, TestingModule } from '@nestjs/testing';
import { PairsController } from './pairs.controller';
import { PairsService } from './pairs.service';
import { Character } from 'src/rickandmorty/rickandmorty.dto';
import { Cat } from 'src/cats/cats.dto';
import { Pair } from './pairs.dto';
import { HttpException } from '@nestjs/common';

describe('PairsController', () => {
  let controller: PairsController;
  let service: PairsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PairsController],
      providers: [
        {
          provide: PairsService,
          useValue: {
            execute: jest.fn().mockResolvedValue({
              cat: {
                id: 'ed8',
                url: 'https://cdn2.thecatapi.com/images/ed8.jpg',
                width: 500,
                height: 500,
              } as Cat,
              character: {
                id: 1,
                name: 'Rick Sanchez',
                status: 'Alive',
                species: 'Human',
                type: '',
                gender: 'Male',
                origin: { name: 'Earth', url: '' },
                location: { name: 'Citadel of Ricks', url: '' },
                image:
                  'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
                episode: [],
                url: '',
                created: '',
              } as Character,
            } as Pair),
          },
        },
      ],
    }).compile();

    controller = module.get<PairsController>(PairsController);
    service = module.get<PairsService>(PairsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return a character and a cat', async () => {
    const result = await controller.get();
    expect(result).toHaveProperty('cat');
    expect(result).toHaveProperty('character');
  });

  it('should throw an error when service fails', async () => {
    jest
      .spyOn(service, 'execute')
      .mockRejectedValue(
        new HttpException({ message: 'Ocorreu um erro na busca' }, 500),
      );

    await expect(controller.get()).rejects.toThrow('Ocorreu um erro na busca');
  });
});
