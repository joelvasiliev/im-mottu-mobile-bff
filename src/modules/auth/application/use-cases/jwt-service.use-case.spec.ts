import { JwtServiceUseCase } from './jwt-service.use-case';
import { JwtService } from '@nestjs/jwt';

describe('JwtServiceUseCase', () => {
  let jwtServiceUseCase: JwtServiceUseCase;
  let mockJwtService: Partial<JwtService>;

  beforeEach(() => {
    mockJwtService = {
      sign: jest.fn().mockReturnValue('mocked-token'),
      verify: jest.fn().mockReturnValue({ userId: '123' }),
    };

    jwtServiceUseCase = new JwtServiceUseCase(mockJwtService as JwtService);
  });

  it('should be defined', () => {
    expect(jwtServiceUseCase).toBeDefined();
  });

  describe('sign', () => {
    it('should call jwt.sign with payload and return a token', () => {
      const payload = JSON.stringify({ userId: '123' });

      const result = jwtServiceUseCase.sign(payload);

      expect(mockJwtService.sign).toHaveBeenCalledWith(payload);
      expect(result).toBe('mocked-token');
    });
  });

  describe('verify', () => {
    it('should call jwt.verify with token and return payload', () => {
      const token = 'fake-jwt-token';

      const result = jwtServiceUseCase.verify(token);

      expect(mockJwtService.verify).toHaveBeenCalledWith(token);
      expect(result).toEqual({ userId: '123' });
    });
  });
});
