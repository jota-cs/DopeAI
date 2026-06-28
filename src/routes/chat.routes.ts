import { Router } from 'express';
import { ChatController } from '../controllers/chat.controller';
import { GenerationController } from '../controllers/generation.controller'; // <-- Importe o novo controller
import { ensureAuthenticated } from '../middlewares/ensure-authenticated';

const chatRoutes = Router();
const chatController = new ChatController();
const generationController = new GenerationController(); // <-- Inicialize

chatRoutes.post('/chat', ensureAuthenticated, chatController.handle);

// NOVA ROTA: Busca o histórico do banco de dados de forma segura
chatRoutes.get('/chat/history', ensureAuthenticated, generationController.index);

export { chatRoutes };