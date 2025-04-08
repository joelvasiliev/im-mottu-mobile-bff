import { Injectable } from '@nestjs/common';
import { CatBreedResponse } from 'src/modules/cats/dto';
import { CatApiRepository } from 'src/repositories/http/cat-api-repository';

@Injectable()
export class ListBreedsUseCase {
  constructor(private readonly catApiRepository: CatApiRepository) {}

  async execute(): Promise<CatBreedResponse[]> {
    const breeds = await this.catApiRepository.listBreeds();
    const filteredBreeds = breeds.map((b) => ({
      id: b.id,
      name: b.name,
    }));

    return filteredBreeds;
  }
}
