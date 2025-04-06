import { HttpService } from '@nestjs/axios';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AxiosError, AxiosResponse } from 'axios';
import {
  Character,
  ResponseCharacterWithFilter,
} from '../../dto/character.dto';
import { ConfigService } from '@nestjs/config';
import { RedisRickAndMortyRepository } from 'src/repositories/cache/redis-rickandmorty-repository';
import { MAX_CHARACTER_ID } from 'src/modules/rickandmorty/constants/character.constants';

@Injectable()
export class RickandmortyService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly redisRickAndMortyRepository: RedisRickAndMortyRepository,
  ) {}

  getRandomNumber(): number {
    return Math.floor(Math.random() * MAX_CHARACTER_ID) + 1;
  }

  async fetchRickAndMortyAPI(character_name: string, page?: number) {
    const apiUrl = this.configService.get<string>('RICK_AND_MORTY_API_URL');
    const response: AxiosResponse<ResponseCharacterWithFilter> =
      await firstValueFrom(
        this.httpService.get<ResponseCharacterWithFilter>(
          `${apiUrl}?name=${character_name}&page=${page || 1}`,
        ),
      );
    return response.data;
  }

  async getRandomCharacter(): Promise<Character> {
    try {
      const randomId = this.getRandomNumber();

      const cached_character =
        await this.redisRickAndMortyRepository.getCachedCharacter(randomId);
      if (cached_character) {
        console.log('Returned character from cache');
        return cached_character;
      }
      console.log('fetch api');

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

      await this.redisRickAndMortyRepository.setCacheCharacter(character);

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

  async getRandomCharacterByName(character_name: string): Promise<Character> {
    try {
      const cached_search =
        await this.redisRickAndMortyRepository.getCachedSearch(
          character_name.trim().toLowerCase(),
        );
      if (cached_search) {
        console.log('Returned search from cache');
        return cached_search;
      }
      console.log('fetch api');
      const { info, results } = await this.fetchRickAndMortyAPI(
        character_name,
        1,
      );
      console.log(info.pages);

      const full_results: Character[] = results;

      if (info.pages > 1) {
        for (let page = 2; page <= info.pages; page++) {
          const nextPage = await this.fetchRickAndMortyAPI(
            character_name,
            page,
          );
          full_results.push(...nextPage.results);
        }
      }
      await this.redisRickAndMortyRepository.setCacheSearch(
        character_name,
        full_results,
      );

      const randomCharacter =
        full_results[Math.floor(Math.random() * full_results.length)];

      return randomCharacter;
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
