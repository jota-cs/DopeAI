import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { IUserRepository } from '../repositories/user.repository';

interface IRequest {
  email: string;
  password: string;
}

interface IResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

export class AuthenticateUserService {
  constructor(private userRepository: IUserRepository) {}

  async execute({ email, password }: IRequest): Promise<IResponse> {
    // 1. Busca o usuário pelo e-mail
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('E-mail ou senha incorretos.');
    }

    // 2. Compara a senha enviada com a senha criptografada do banco
    const passwordMatch = await compare(password, user.password);
    if (!passwordMatch) {
      throw new Error('E-mail ou senha incorretos.');
    }

    // 3. Gera o Token JWT contendo apenas o ID do usuário (payload enxuto)
    const secret = process.env.JWT_SECRET || 'default-secret';
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn: '1d', // Expira em 1 dia
    });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    };
  }
}