import { Request, Response } from 'express';
import { GenerationRepository } from '../repositories/generation.repository';

export class GenerationController {
  async index(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.body; // Pego o ID do usuário que o middleware validou

      const generationRepository = new GenerationRepository();
      const history = await generationRepository.findByUserId(userId);

      return res.status(200).json(history);
    } catch (error: any) {
      return res.status(500).json({ message: error.message || 'Erro ao buscar histórico.' });
    }
  }
}