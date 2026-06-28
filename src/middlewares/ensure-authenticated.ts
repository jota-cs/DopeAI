import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

interface ITokenPayload {
  sub: string; // O ID do usuário que guardamos no 'subject' do JWT durante o login
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
  // 1. Pega o cabeçalho de autorização da requisição
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token não fornecido. Acesso negado.' });
  }

  // O cabeçalho vem no formato: "Bearer seu_token_jwt_aqui"
  // Dividimos a string pelo espaço para pegar apenas o token
  const [, token] = authHeader.split(' ');

  try {
    const secret = process.env.JWT_SECRET || 'default-secret';
    
    // 2. Valida se o token é legítimo e não foi alterado
    const decoded = verify(token, secret);

    const { sub } = decoded as ITokenPayload;

    // 3. NOVIDADE: Anexamos o ID do usuário dentro do corpo da requisição 
    // para que o Controller possa usar depois
    req.body.userId = sub;

    // 4. Libera o usuário para seguir para a rota principal
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado. Faça login novamente.' });
  }
}