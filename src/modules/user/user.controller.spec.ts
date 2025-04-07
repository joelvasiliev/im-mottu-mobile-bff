import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { GetUserByEmailUseCase } from './application/use-cases/get-user-by-email.use-case';
import { CreateUserDto } from './dto/create-user.dto';

describe('UserController', () => {
  let controller: UserController;
  let createUserUseCase: CreateUserUseCase;
  let getUserByEmailUseCase: GetUserByEmailUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: CreateUserUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: GetUserByEmailUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    createUserUseCase = module.get<CreateUserUseCase>(CreateUserUseCase);
    getUserByEmailUseCase = module.get<GetUserByEmailUseCase>(
      GetUserByEmailUseCase,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      const dto: CreateUserDto = {
        email: 'joel@example.com',
        password: 'securepassword',
      };

      const createdUser = {
        id: '1',
        email: dto.email,
        password: 'hashedpassword',
      };

      jest.spyOn(createUserUseCase, 'execute').mockResolvedValue(createdUser);

      const result = await controller.create(dto);

      expect(result).toEqual(createdUser);
    });
  });

  describe('getByEmail', () => {
    it('should get user by email', async () => {
      const email = 'joel@example.com';
      const user = {
        id: '2',
        email,
        password: 'hashedpassword',
      };

      jest.spyOn(getUserByEmailUseCase, 'execute').mockResolvedValue(user);

      const result = await controller.getByEmail(email);

      expect(result).toEqual(user);
    });
  });
});
