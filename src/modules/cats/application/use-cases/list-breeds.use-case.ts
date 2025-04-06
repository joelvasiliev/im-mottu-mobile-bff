import { Injectable } from '@nestjs/common';
import { CatBreedResponse } from 'src/modules/cats/dto';
import { CatApiRepository } from 'src/repositories/http/cat-api-repository';

@Injectable()
export class ListBreedsUseCase {
  constructor(private readonly catApiRepository: CatApiRepository) {}

  async execute(): Promise<CatBreedResponse[]> {
    return this.catApiRepository.listBreeds();
  }
}
