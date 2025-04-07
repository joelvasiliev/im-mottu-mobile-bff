import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cat, CatBreedResponse } from 'src/modules/cats/dto';
import { RedisCatRepository } from 'src/modules/cats/infra/cache/redis-cat-repository';
import { CatApiRepository } from 'src/repositories/http/cat-api-repository';
import { ListBreedsUseCase } from './list-breeds.use-case';

@Injectable()
export class GetRandomCatByBreedUseCase {
  constructor(
    private readonly catApiRepository: CatApiRepository,
    private readonly redisCatRepository: RedisCatRepository,
    private readonly listBreedsUseCase: ListBreedsUseCase,
  ) {}

  async execute(breed: string): Promise<Cat> {
    let breeds: CatBreedResponse[] | null;
    breeds = await this.redisCatRepository.getCachedBreeds();
    if (!breeds) {
      breeds = await this.listBreedsUseCase.execute();
    }
    const breed_exists = breeds.find((b) => b.id === breed);
    if (!breed_exists) {
      throw new HttpException(
        {
          message:
            'Raça inválida. Para ver as raças disponíveis utilize a rota GET - cats/breeds',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const cat = await this.catApiRepository.getRandomCatByBreed(breed);

    return cat;
  }
}
