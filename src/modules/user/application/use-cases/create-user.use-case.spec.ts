import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserUseCase } from './create-user.use-case';
import { UserRepository } from 'src/repositories/prisma/user-repository';
import { CreateUserDto } from '../../dto/create-user.dto';

describe('CreateUserUseCase', () => {
  let useCase: CreateUserUseCase;
  let userRepository: Partial<UserRepository>;

  const inputData: CreateUserDto = {
    email: 'john@example.com',
    password: '123456',
  };

  const createdUser = {
    id: 'abc123',
    email: inputData.email,
    password: 'hashed-password',
  };

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    };

    useCase = new CreateUserUseCase(userRepository as UserRepository);
  });

  it('should create a user if email is not already in use', async () => {
    (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    (userRepository.create as jest.Mock).mockResolvedValue(createdUser);

    const result = await useCase.execute(inputData);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(inputData.email);
    expect(userRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: inputData.email,
        password: expect.any(String),
      }),
    );
    expect(result).toEqual(createdUser);
  });

  it('should throw ConflictException if email is already in use', async () => {
    (userRepository.findByEmail as jest.Mock).mockResolvedValue(createdUser);

    await expect(useCase.execute(inputData)).rejects.toThrow(ConflictException);
    expect(userRepository.findByEmail).toHaveBeenCalledWith(inputData.email);
    expect(userRepository.create).not.toHaveBeenCalled();
  });

  it('should hash the user password before saving', async () => {
    (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);
    (userRepository.create as jest.Mock).mockImplementation(
      (data: CreateUserDto & { password: string }) => ({
        id: 'mock-id',
        ...data,
      }),
    );

    const result = await useCase.execute(inputData);

    const isPasswordHashed = await bcrypt.compare(
      inputData.password,
      result.password,
    );
    expect(isPasswordHashed).toBe(true);
  });
});
