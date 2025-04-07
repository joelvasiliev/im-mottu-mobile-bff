import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosError, AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import {
  Character,
  ResponseCharacterWithFilter,
} from 'src/modules/rickandmorty/dto';
import { RickAndMortyApiRepository } from 'src/repositories/http/rick-and-morty-api-repository';

@Injectable()
export class RickAndMortyApiHttpRepository
  implements RickAndMortyApiRepository
{
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async getCharacterById(character_id: number): Promise<Character> {
    const apiUrl = this.configService.get<string>('RICK_AND_MORTY_API_URL');

    try {
      const response: AxiosResponse<Character> = await firstValueFrom(
        this.httpService.get<Character>(`${apiUrl}${character_id}`),
      );
      const character = response.data;

      return character;
    } catch (error) {
      const axiosError = error as AxiosError;

      const details: string = axiosError.response?.data
        ? JSON.stringify(axiosError.response.data)
        : axiosError.message;

      throw new HttpException(
        {
          message: `Erro ao buscar personagem ID ${character_id} na API Rick and Morty`,
          details,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async listCharactersByNamePaginated(
    character_name: string,
    page?: number,
  ): Promise<ResponseCharacterWithFilter> {
    const apiUrl = this.configService.get<string>('RICK_AND_MORTY_API_URL');

    try {
      const response: AxiosResponse<ResponseCharacterWithFilter> =
        await firstValueFrom(
          this.httpService.get<ResponseCharacterWithFilter>(
            `${apiUrl}?name=${character_name}&page=${page || 1}`,
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
          message: `Erro ao buscar personagens com nome "${character_name}" na página ${page || 1}`,
          details,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
