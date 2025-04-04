import { User } from '@prisma/client';

export abstract class UserRepository {
  abstract findMany(): Promise<User[]>;
  // abstract create(input: Partial<User>): Promise<User>;
  // abstract update(input: Partial<User>): Promise<User>;
  // abstract delete(user_id: string): Promise<User>;
}
