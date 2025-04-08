import { AuthController } from './auth.controller';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let mockLoginUseCase: Partial<LoginUseCase>;

  const mockToken = { access_token: 'mocked-token' };

  beforeEach(() => {
    mockLoginUseCase = {
      execute: jest.fn().mockResolvedValue(mockToken),
    };

    authController = new AuthController(mockLoginUseCase as LoginUseCase);
  });

  it('should call loginUseCase.execute with email and password and return token', async () => {
    const dto: LoginDto = {
      email: 'test@example.com',
      password: 'secure-password',
    };

    const result = await authController.login(dto);

    expect(mockLoginUseCase.execute).toHaveBeenCalledWith(
      dto.email,
      dto.password,
    );
    expect(result).toEqual(mockToken);
  });
});
