import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { Character } from './rickandmorty.dto';

const MAX_CHARACTER_ID = 826;

@Injectable()
export class RickandmortyService {
  constructor(private readonly httpService: HttpService) {}

  getRandomNumber(): number {
    return Math.floor(Math.random() * MAX_CHARACTER_ID) + 1;
  }

  async getRandomCharacter(): Promise<Character> {
    try {
      const randomId = this.getRandomNumber();
      const response: AxiosResponse<Character> = await firstValueFrom(
        this.httpService.get<Character>(
          `https://rickandmortyapi.com/api/character/${randomId}`,
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
          message: 'Ocorreu um erro ao buscar dados da RickAndMortyAPI',
          details,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
