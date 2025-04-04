import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { Cat, CatBreed, CatBreedResponse } from './cats.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CatsService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getRandomCat(): Promise<Cat> {
    try {
      const apiUrl = this.configService.get<string>('CAT_API_URL');
      const response: AxiosResponse<Cat[]> = await firstValueFrom(
        this.httpService.get<Cat[]>(`${apiUrl}images/search`),
      );

      const cats = response.data;

      if (cats.length === 0) {
        throw new HttpException(
          {
            message: 'Nenhum gato retornado na TheCatsAPI',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const cat = cats[0];

      if (!cat.id || !cat.url || !cat.width || !cat.height) {
        throw new HttpException(
          {
            message: 'Os dados do gato retornado são inválidos',
            details: cat,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return cat;
    } catch (error) {
      const axiosError = error as AxiosError;

      const details: string = axiosError.response?.data
        ? JSON.stringify(axiosError.response.data)
        : axiosError.message;

      throw new HttpException(
        {
          message: 'Ocorreu um erro ao buscar dados da TheCatAPI',
          details,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async getBreeds(): Promise<CatBreedResponse[]> {
    try {
      const apiUrl = this.configService.get<string>('CAT_API_URL');
      const response: AxiosResponse<CatBreed[]> = await firstValueFrom(
        this.httpService.get<CatBreed[]>(`${apiUrl}breeds`),
      );

      const breeds = response.data;

      if (breeds.length === 0) {
        throw new HttpException(
          {
            message: 'Nenhuma raça retornado na TheCatsAPI',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      const filtered_breeds = breeds.map((breed) => {
        return {
          id: breed.id,
          name: breed.name,
        };
      });

      return filtered_breeds;
    } catch (error) {
      const axiosError = error as AxiosError;

      const details: string = axiosError.response?.data
        ? JSON.stringify(axiosError.response.data)
        : axiosError.message;

      throw new HttpException(
        {
          message: 'Ocorreu um erro ao buscar dados da TheCatAPI',
          details,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
