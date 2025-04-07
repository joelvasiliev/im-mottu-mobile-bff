import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtServiceUseCase } from 'src/modules/auth/application/use-cases/jwt-service.use-case';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtServiceUseCase) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Token missing');
    }

    const token: string = authHeader.split(' ')[1];

    try {
      const decoded = this.jwtService.verify(token);
      request.user = decoded;
      console.log(request.user);
      return true;
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
