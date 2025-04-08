import { LoginUseCase } from './login.use-case';
import { JwtServiceUseCase } from './jwt-service.use-case';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserRepository } from 'src/repositories/prisma/user-repository';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let mockUserRepository: Partial<UserRepository>;
  let mockJwtService: Partial<JwtServiceUseCase>;

  const mockUser = {
    id: 'user-123',
    email: 'test@example.com',
    password: 'hashed-password',
  };

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
    };

    mockJwtService = {
      sign: jest.fn().mockReturnValue('mocked-token'),
    };

    loginUseCase = new LoginUseCase(
      mockUserRepository as UserRepository,
      mockJwtService as JwtServiceUseCase,
    );
  });

  it('should return access_token when credentials are valid', async () => {
    (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await loginUseCase.execute(
      'test@example.com',
      'valid-password',
    );

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      'test@example.com',
    );
    expect(bcrypt.compare).toHaveBeenCalledWith(
      'valid-password',
      mockUser.password,
    );
    expect(mockJwtService.sign).toHaveBeenCalledWith({
      sub: mockUser.id,
      email: mockUser.email,
    });
    expect(result).toEqual({ access_token: 'mocked-token' });
  });

  it('should throw UnauthorizedException if user not found', async () => {
    (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(null);

    await expect(
      loginUseCase.execute('notfound@example.com', 'any-password'),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException if password is invalid', async () => {
    (mockUserRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      loginUseCase.execute('test@example.com', 'wrong-password'),
    ).rejects.toThrow(UnauthorizedException);

    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      'test@example.com',
    );
    expect(bcrypt.compare).toHaveBeenCalledWith(
      'wrong-password',
      mockUser.password,
    );
  });
});
