import { CatBreedResponse } from 'src/cats/cats.dto';

export abstract class CatRepository {
  // abstract get(): Promise<Cat>;
  abstract getCachedBreeds(): Promise<CatBreedResponse[] | null>;
  abstract setCacheBreeds(breeds: CatBreedResponse[]): Promise<void>;
}
