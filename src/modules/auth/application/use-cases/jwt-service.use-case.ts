import { Injectable } from '@nestjs/common';
import { JwtService as NestJwtService } from '@nestjs/jwt';

@Injectable()
export class JwtServiceUseCase {
  constructor(private jwt: NestJwtService) {}

  sign(payload: any): any {
    return this.jwt.sign(payload as string);
  }

  verify(token: string): any {
    return this.jwt.verify(token);
  }
}
