import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { Cat, CatBreed } from 'src/modules/cats/dto';

@Injectable()
export class CatApiHttpRepository {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async listBreeds(): Promise<CatBreed[]> {
    const apiUrl = this.configService.get<string>('CAT_API_URL');

    try {
      const response: AxiosResponse<CatBreed[]> = await firstValueFrom(
        this.httpService.get<CatBreed[]>(`${apiUrl}breeds`),
      );

      const breeds = response.data;

      if (breeds.length === 0) {
        throw new HttpException(
          {
            message: 'Nenhuma raça retornada na TheCatAPI',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return breeds;
    } catch (error) {
      const axiosError = error as AxiosError;
      const details = axiosError.response?.data
        ? JSON.stringify(axiosError.response.data)
        : axiosError.message;

      throw new HttpException(
        {
          message: 'Erro ao buscar raças na TheCatAPI',
          details,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRandomCat(): Promise<Cat> {
    const apiUrl = this.configService.get<string>('CAT_API_URL');

    try {
      const response: AxiosResponse<Cat[]> = await firstValueFrom(
        this.httpService.get<Cat[]>(`${apiUrl}images/search`),
      );

      const cats = response.data;

      if (cats.length === 0) {
        throw new HttpException(
          {
            message: 'Nenhum gato retornado na TheCatAPI',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return cats[0];
    } catch (error) {
      const axiosError = error as AxiosError;
      const details = axiosError.response?.data
        ? JSON.stringify(axiosError.response.data)
        : axiosError.message;

      throw new HttpException(
        {
          message: 'Erro ao buscar um gato aleatório na TheCatAPI',
          details,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async getRandomCatByBreed(breed: string): Promise<Cat> {
    const apiUrl = this.configService.get<string>('CAT_API_URL');

    try {
      const response: AxiosResponse<Cat[]> = await firstValueFrom(
        this.httpService.get<Cat[]>(
          `${apiUrl}images/search?breed_ids=${breed}`,
        ),
      );

      const cats = response.data;

      if (cats.length === 0) {
        throw new HttpException(
          {
            message: 'Nenhum gato retornado na TheCatAPI',
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return cats[0];
    } catch (error) {
      const axiosError = error as AxiosError;
      const details = axiosError.response?.data
        ? JSON.stringify(axiosError.response.data)
        : axiosError.message;

      throw new HttpException(
        {
          message: `Erro ao buscar gatos pela raça "${breed}" na TheCatAPI`,
          details,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
