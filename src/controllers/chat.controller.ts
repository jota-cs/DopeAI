import { Request, Response } from 'express';
import { z } from 'zod';
import { GeminiChatService } from '../services/gemini-chat.service';

const chatBodySchema = z.object({
  message: z.string().min(1, 'A mensagem não pode estar vazia.').max(2000, 'Mensagem muito longa para o Free Tier.'),
});

export class ChatController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      // Validação estrita de entrada
      const { message } = chatBodySchema.parse(req.body);
      
      // O ID do usuário logado vem anexado após passar pelo seu middleware de JWTfuturo
      const userId = req.body.userId || 'anonymous'; 

      const geminiChatService = new GeminiChatService();
      const result = await geminiChatService.execute({ message, userId });

      return res.status(200).json(result);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: 'Erro de validação', errors: error.errors });
      }
      return res.status(500).json({ message: error.message || 'Erro interno no servidor.' });
    }
  }
}