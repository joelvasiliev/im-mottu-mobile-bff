import { Cat, CatBreedResponse } from 'src/cats/cats.dto';

export abstract class CatRepository {
  abstract get(): Promise<Cat>;
  abstract getBreeds(): Promise<CatBreedResponse[]>;
}
