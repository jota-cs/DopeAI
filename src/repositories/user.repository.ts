import { User } from '@prisma/client';

export interface ICreateUserDTO {
  email: string;
  name: string;
  passwordHash: string;
}

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  create(data: ICreateUserDTO): Promise<User>;
}