import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { Cat } from './cats.dto';

@Injectable()
export class CatsService {
  constructor(private readonly httpService: HttpService) {}

  async getRandomCat(): Promise<Cat[]> {
    try {
      const response: AxiosResponse<Cat[]> = await firstValueFrom(
        this.httpService.get<Cat[]>(
          `https://api.thecatapi.com/v1/images/search`,
        ),
      );

      return response.data;
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
