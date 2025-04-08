import { UserController } from './user.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUserByEmailUseCase } from './application/use-cases/get-user-by-email.use-case';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let mockCreateUserUseCase: Partial<CreateUserUseCase>;
  let mockGetUserByEmailUseCase: Partial<GetUserByEmailUseCase>;

  const mockUser = {
    id: '1',
    name: 'Joel Vasiliev',
    email: 'joel@example.com',
    password: 'hashed-password',
  };

  beforeEach(() => {
    mockCreateUserUseCase = {
      execute: jest.fn().mockResolvedValue(mockUser),
    };

    mockGetUserByEmailUseCase = {
      execute: jest.fn().mockResolvedValue(mockUser),
    };

    controller = new UserController(
      mockCreateUserUseCase as CreateUserUseCase,
      mockGetUserByEmailUseCase as GetUserByEmailUseCase,
    );
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto: CreateUserDto = {
        email: 'joel@example.com',
        password: '123456',
      };

      const result = await controller.create(dto);

      expect(mockCreateUserUseCase.execute).toHaveBeenCalledWith(dto);
      expect(result).toEqual(mockUser);
    });
  });

  describe('getByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'joel@example.com';

      const result = await controller.getByEmail(email);

      expect(mockGetUserByEmailUseCase.execute).toHaveBeenCalledWith(email);
      expect(result).toEqual(mockUser);
    });
  });
});
