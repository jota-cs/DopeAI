import { PrismaClient, User } from '@prisma/client';
import { IUserRepository, ICreateUserDTO } from '../user.repository';

const prisma = new PrismaClient();

export class PrismaUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { email },
    });
  }

  async create(data: ICreateUserDTO): Promise<User> {
    return prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        password: data.passwordHash,
      },
    });
  }
}