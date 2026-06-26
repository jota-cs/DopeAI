import { Request, Response } from 'express';
import { z } from 'zod';
import { PrismaUserRepository } from '../repositories/prisma/prisma-user.repository';
import { AuthenticateUserService } from '../services/authenticate-user.service';

const authenticateBodySchema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
});

export class AuthController {
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = authenticateBodySchema.parse(req.body);

      const userRepository = new PrismaUserRepository();
      const authenticateUser = new AuthenticateUserService(userRepository);

      const result = await authenticateUser.execute({ email, password });

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Erro de validação', errors: error.errors });
      }
      return res.status(400).json({ message: error.message || 'Erro interno' });
    }
  }
}