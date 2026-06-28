import { PrismaClient, type Generation } from '@prisma/client';

const prisma = new PrismaClient();

export interface ICreateGenerationDTO {
  prompt: string;
  response: string;
  userId: string;
}

export class GenerationRepository {
    
  async create(data: ICreateGenerationDTO): Promise<Generation> {
    return prisma.generation.create({
      data: {
        prompt: data.prompt,
        response: data.response,
        userId: data.userId,
      },
    });
  }
  async findByUserId(userId: string): Promise<Generation[]> {
  return prisma.generation.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' } // Mostra o chat na ordem cronológica correta
  });
}
}