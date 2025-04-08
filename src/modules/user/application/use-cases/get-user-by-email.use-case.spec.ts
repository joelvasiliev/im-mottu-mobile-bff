import { GetUserByEmailUseCase } from './get-user-by-email.use-case';
import { UserRepository } from 'src/repositories/prisma/user-repository';
import { NotFoundException } from '@nestjs/common';

describe('GetUserByEmailUseCase', () => {
  let useCase: GetUserByEmailUseCase;
  let userRepository: Partial<UserRepository>;

  const mockUser = {
    id: 'user-id-123',
    email: 'test@example.com',
    password: 'hashed-password',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    userRepository = {
      findByEmail: jest.fn(),
    };

    useCase = new GetUserByEmailUseCase(userRepository as UserRepository);
  });

  it('should return user data if user is found', async () => {
    (userRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);

    const result = await useCase.execute(mockUser.email);

    expect(userRepository.findByEmail).toHaveBeenCalledWith(mockUser.email);
    expect(result).toEqual({
      id: mockUser.id,
      email: mockUser.email,
    });
  });

  it('should throw NotFoundException if user is not found', async () => {
    (userRepository.findByEmail as jest.Mock).mockResolvedValue(null);

    await expect(useCase.execute('notfound@example.com')).rejects.toThrow(
      NotFoundException,
    );

    expect(userRepository.findByEmail).toHaveBeenCalledWith(
      'notfound@example.com',
    );
  });
});
