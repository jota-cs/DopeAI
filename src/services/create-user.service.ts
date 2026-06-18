import { IUserRepository } from '../repositories/user.repository';
import { User } from '@prisma/client';

interface IRequest {
  name: string;
  email: string;
  password: string;
}

// DTO de resposta limpo para evitar o vazamento do hash da senha (Diretriz de Payload)
interface IResponse {
  user: {
    id: string;
    name: string;
    email: string;
    createdAt: Date;
  };
}

export class CreateUserService {
  constructor(private userRepository: IUserRepository) {}

  async execute({ name, email, password }: IRequest): Promise<IResponse> {
    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new Error('Este e-mail já está em uso.');
    }

    // ATENÇÃO: Em produção, faça o hash da senha aqui antes de salvar!
    const passwordHash = password; // Ex: await bcrypt.hash(password, 8);

    const user = await this.userRepository.create({
      name,
      email,
      passwordHash,
    });

    // Retornamos estritamente os campos necessários, preservando banda e segurança
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      },
    };
  }
}