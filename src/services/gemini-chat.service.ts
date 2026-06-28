import { GoogleGenAI } from '@google/genai';
import { GenerationRepository } from '../repositories/generation.repository';

interface IChatRequest {
  message: string;
  userId: string;
}

export class GeminiChatService {
  private ai: GoogleGenAI;
  private generationRepository: GenerationRepository; // <--- Adicionado

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Chave de API do Gemini não configurada.');
    }
    this.ai = new GoogleGenAI({ apiKey });
    this.generationRepository = new GenerationRepository(); // <--- Inicializado
  }

  async execute({ message, userId }: IChatRequest) {
    try {
      const geminiResponse = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: message,
      });

      const textResponse = geminiResponse.text;
      if (!textResponse) {
        throw new Error('O Gemini não retornou nenhuma resposta.');
      }

      // NOVIDADE: Se o usuário estiver logado, salvamos o histórico de verdade no Supabase!
      // (Evitamos salvar se for um usuário anônimo de teste)
      if (userId && userId !== 'anonymous' && userId !== 'usr_internal') {
        await this.generationRepository.create({
          prompt: message,
          response: textResponse,
          userId: userId,
        });
      }

      return {
        response: textResponse,
      };
    } catch (error: any) {
      throw new Error(`Falha na gravação ou na IA: ${error.message}`);
    }
  }
}