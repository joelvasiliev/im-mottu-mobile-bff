import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService extends Redis {
  constructor(configService: ConfigService) {
    const host = configService.get<string>('REDIS_HOST');
    const port = configService.get<number>('REDIS_PORT');

    super({
      host,
      port,
    });

    // Listeners
    this.on('error', (err) => {
      console.error('❌ Redis error');
      console.error(err);
      process.exit(1);
    });

    this.on('connect', () => {
      console.log('✅ Redis connected!');
    });
  }
}
