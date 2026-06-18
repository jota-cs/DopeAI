import { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaUserRepository } from '../repositories/prisma/prisma-user.repository';
import { CreateUserService } from '../services/create-user.service';

// Schema de validação estrita usando Zod
const createUserBodySchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

export class UserController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      // Validação imediata dos dados de entrada
      const { name, email, password } = createUserBodySchema.parse(req.body);

      const userRepository = new PrismaUserRepository();
      const createUserService = new CreateUserService(userRepository);

      const result = await createUserService.execute({ name, email, password });

      return res.status(201).json(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Erro de validação", errors: error.errors });
      }
      return res.status(400).json({ error: error.message || 'Erro interno no servidor' });
    }
  }
}