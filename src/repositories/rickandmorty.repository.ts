import { Character } from 'src/modules/rickandmorty/rickandmorty.dto';

export abstract class RickAndMortyRepository {
  abstract getCachedCharacter(character_id: number): Promise<Character | null>;
  abstract setCacheCharacter(character: Character): Promise<void>;
}
