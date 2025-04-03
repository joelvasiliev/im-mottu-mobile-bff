import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import { Character } from './rickandmorty.dto';
import { ConfigService } from '@nestjs/config';

const MAX_CHARACTER_ID = 826;

@Injectable()
export class RickandmortyService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  getRandomNumber(): number {
    return Math.floor(Math.random() * MAX_CHARACTER_ID) + 1;
  }

  async getRandomCharacter(): Promise<Character> {
    try {
      const randomId = this.getRandomNumber();
      const apiUrl = this.configService.get<string>('RICK_AND_MORTY_API_URL');
      const response: AxiosResponse<Character> = await firstValueFrom(
        this.httpService.get<Character>(`${apiUrl}${randomId}`),
      );
      const character = response.data;

      if (!character.id || !character.name || !character.image) {
        throw new HttpException(
          {
            message:
              'Os dados retornados da The Rick and Morty API estão inválidos',
            details: character,
          },
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return character;
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
