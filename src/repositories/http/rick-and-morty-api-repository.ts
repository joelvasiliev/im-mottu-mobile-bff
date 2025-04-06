import {
  Character,
  ResponseCharacterWithFilter,
} from 'src/modules/rickandmorty/dto';

export abstract class RickAndMortyApiRepository {
  abstract getCharacterById(character_id: number): Promise<Character>;
  abstract listCharactersByNamePaginated(
    character_name: string,
    page?: number,
  ): Promise<ResponseCharacterWithFilter>;
}
