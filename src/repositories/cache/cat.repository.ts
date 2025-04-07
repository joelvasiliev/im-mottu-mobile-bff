import { CatBreedResponse } from 'src/modules/cats/dto';

export abstract class CatRepository {
  // abstract get(): Promise<Cat>;
  abstract getCachedBreeds(): Promise<CatBreedResponse[] | null>;
  abstract setCacheBreeds(breeds: CatBreedResponse[]): Promise<void>;
}
