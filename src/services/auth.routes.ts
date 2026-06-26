import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post('/sessions', authController.login);

export { authRoutes };