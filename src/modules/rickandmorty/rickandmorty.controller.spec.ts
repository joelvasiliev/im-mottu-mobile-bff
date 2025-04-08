import { RickandmortyController } from './rickandmorty.controller';
import { GetRandomCharacterUseCase } from './application/use-cases';
import { Character } from './dto/character.dto';

describe('RickandmortyController', () => {
  let controller: RickandmortyController;
  let mockGetRandomCharacterUseCase: Partial<GetRandomCharacterUseCase>;

  const mockCharacter: Character = {
    id: 1,
    name: 'Rick Sanchez',
    image: 'rick.png',
    status: 'Alive',
    species: 'Human',
    gender: 'Male',
    origin: { name: 'Earth', url: 'https://example.com' },
    location: { name: 'Citadel of Ricks', url: 'https://example.com' },
    created: new Date(Date.now()).toISOString(),
    episode: ['1'],
    type: '',
    url: 'https://example.com',
  };

  beforeEach(() => {
    mockGetRandomCharacterUseCase = {
      execute: jest.fn().mockResolvedValue(mockCharacter),
    };

    controller = new RickandmortyController(
      mockGetRandomCharacterUseCase as GetRandomCharacterUseCase,
    );
  });

  it('should return a random Rick and Morty character', async () => {
    const result = await controller.get();

    expect(mockGetRandomCharacterUseCase.execute).toHaveBeenCalled();
    expect(result).toEqual(mockCharacter);
  });
});
