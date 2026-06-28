import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// PASSO A: Importamos as rotas de usuários que você criou no arquivo anterior
import { userRoutes } from './routes/user.routes';
import { authRoutes } from './services/auth.routes';
import { chatRoutes } from './routes/chat.routes'

dotenv.config();

const app: Application = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Rota de Health Check (Apenas para ver se o servidor está vivo)
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

// PASSO B: Injetamos as rotas no Express. 
// A partir deste momento, o Express passa a escutar a rota POST '/users'
app.use(userRoutes);
app.use(authRoutes);
app.use(chatRoutes);
export { app };
