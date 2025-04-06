import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { Cat } from 'src/modules/cats/dto';
import { CatApiRepository } from 'src/repositories/http/cat-api-repository';

@Injectable()
export class GetRandomCatUseCase {
  constructor(private readonly catApiRepository: CatApiRepository) {}

  async execute(): Promise<Cat> {
    const cat = await this.catApiRepository.getRandomCat();

    if (!this.isValidCat(cat)) {
      throw new HttpException(
        {
          message: 'Os dados do gato retornado são inválidos',
          details: cat,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return cat;
  }

  private isValidCat(cat: Cat): boolean {
    return Boolean(cat.id && cat.url && cat.width && cat.height);
  }
}
