import { Character } from 'src/modules/rickandmorty/dto/character.dto';

export abstract class RickAndMortyRepository {
  abstract getCachedCharacter(character_id: number): Promise<Character | null>;
  abstract setCacheCharacter(character: Character): Promise<void>;
}
