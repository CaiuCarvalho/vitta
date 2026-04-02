import { prisma, Prisma, User, Address } from "@vitta/database";
import bcrypt from "bcryptjs";
import { AppError } from "../utils/AppError";
import { CreateUserDTO, UpdateUserDTO } from "../dtos/user.dto";
import { EmailService } from "./email.service";
import { VerificationService } from "./verification.service";
import { UserMapper } from "../dtos/user.mapper";
import { UserProfile } from "@vitta/utils";

export interface PaginatedUsers {
  users: UserProfile[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class UserService {
  static async getAllUsers(page: number = 1, limit: number = 20): Promise<PaginatedUsers> {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count(),
    ]);

    return { 
      users: UserMapper.toPublicDTOList(users), 
      total, 
      page, 
      limit, 
      totalPages: Math.ceil(total / limit) 
    };
  }

  static async getUserById(id: string): Promise<UserProfile | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        addresses: {
          orderBy: { createdAt: "desc" },
        },
        orders: {
          include: { 
            items: { include: { product: true } }
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    return user ? UserMapper.toPublicDTO(user) : null;
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    // Para uso interno de autenticacao onde precisamos da senha etc, nao usar Mapper
    return prisma.user.findUnique({
      where: { email },
    });
  }

  static async createUser(data: CreateUserDTO): Promise<UserProfile> {
    const user = await prisma.user.create({
      data
    });
    return UserMapper.toPublicDTO(user);
  }

  static async updateUser(id: string, data: UpdateUserDTO): Promise<UserProfile> {
    const user = await prisma.user.update({
      where: { id },
      data
    });
    return UserMapper.toPublicDTO(user);
  }

  static async deleteUser(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }

  static async updateProfile(id: string, data: { name?: string; phone?: string; taxId?: string; avatarUrl?: string }): Promise<UserProfile> {
    const user = await prisma.user.update({
      where: { id },
      data,
    });
    return UserMapper.toPublicDTO(user);
  }

  static async addAddress(userId: string, data: {
    zipCode: string;
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    isDefault?: boolean;
  }): Promise<Address> {
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });
    }

    return prisma.address.create({
      data: {
        userId,
        ...data,
      },
    });
  }

  static async updatePassword(id: string, currentPass: string, newPass: string): Promise<UserProfile> {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new AppError("Usuário não encontrado", 404);

    const isMatch = await bcrypt.compare(currentPass, user.password_hash);
    if (!isMatch) throw new AppError("Senha atual incorreta", 401);

    const password_hash = await bcrypt.hash(newPass, 12);
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { password_hash },
    });

    try {
      await EmailService.sendPasswordChangeEmail(updatedUser.email, updatedUser.name);
    } catch (err) {
      console.warn(`[UserService] Falha ao enviar email de troca de senha para ${updatedUser.email}`);
    }

    return UserMapper.toPublicDTO(updatedUser);
  }

  static async requestUpdate(id: string, type: 'EMAIL_UPDATE' | 'TAXID_UPDATE', newValue: string): Promise<{ success: boolean; message: string }> {
    if (!['EMAIL_UPDATE', 'TAXID_UPDATE'].includes(type)) {
      throw new AppError("Tipo de atualização inválido.", 400);
    }

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) throw new AppError("Usuário não encontrado.", 404);

    if (type === 'EMAIL_UPDATE') {
      const existing = await prisma.user.findUnique({ where: { email: newValue } });
      if (existing) throw new AppError("Este e-mail já está em uso.", 409);
    }

    const verification = await VerificationService.generateToken(id, type, newValue);
    await EmailService.sendUpdateVerificationEmail(user.email, user.name, verification.token, type);

    return { success: true, message: "Código enviado para seu e-mail." };
  }

  static async confirmUpdate(id: string, token: string, type: 'EMAIL_UPDATE' | 'TAXID_UPDATE'): Promise<{ success: boolean; message: string }> {
    const verification = await VerificationService.validateToken(id, token, type);

    const updateData: Prisma.UserUpdateInput = {};
    if (type === 'EMAIL_UPDATE') updateData.email = verification.newValue;
    if (type === 'TAXID_UPDATE') updateData.taxId = verification.newValue;

    await prisma.user.update({
      where: { id },
      data: updateData
    });
    
    await VerificationService.removeToken(verification.id);

    return { success: true, message: "Dados atualizados com sucesso!" };
  }
}
