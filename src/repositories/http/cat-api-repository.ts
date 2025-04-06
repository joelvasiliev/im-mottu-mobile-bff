import { Cat, CatBreed } from 'src/modules/cats/dto';

export abstract class CatApiRepository {
  abstract getRandomCat(): Promise<Cat>;
  abstract listBreeds(): Promise<CatBreed[]>;
  abstract getRandomCatByBreed(breed: string): Promise<Cat>;
}
