import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserService } from "./user.service";
import { AppError } from "../utils/AppError";
import { LoginDTO } from "../dtos/user.dto";
import { EmailService } from "./email.service";
import { VerificationService } from "./verification.service";
import { UserProfile } from "@vitta/utils";
import { UserMapper } from "../dtos/user.mapper";

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("FATAL: JWT_SECRET environment variable is not set.");
  }
  return secret;
}

export class AuthService {
  static async register(data: RegisterDTO): Promise<UserProfile> {
    const existing = await UserService.getUserByEmail(data.email);
    if (existing) {
      throw new AppError("Email já cadastrado", 409);
    }

    const password_hash = await bcrypt.hash(data.password, 12);
    const userProfile = await UserService.createUser({
      name: data.name,
      email: data.email,
      password_hash,
    });

    try {
      await EmailService.sendWelcomeEmail(userProfile.email, userProfile.name);
    } catch (err: any) {
      console.warn("Não foi possível enviar o email de boas-vindas, mas o registro foi bem-sucedido:", err.message);
    }

    return userProfile;
  }

  static async login(data: LoginDTO): Promise<AuthResponse> {
    const user = await UserService.getUserByEmail(data.email);
    if (!user) {
      throw new AppError("E-mail ou senha inválidos", 401);
    }

    const isMatch = await bcrypt.compare(data.password, user.password_hash);
    if (!isMatch) {
      throw new AppError("E-mail ou senha inválidos", 401);
    }

    const secret = getJwtSecret();
    const token = jwt.sign(
      { userId: user.id, role: user.role || "USER" },
      secret,
      { expiresIn: "7d" }
    );

    return {
      token,
      user: UserMapper.toPublicDTO(user),
    };
  }

  static async forgotPassword(email: string): Promise<{ success: boolean }> {
    const user = await UserService.getUserByEmail(email);
    
    if (!user) {
      return { success: true };
    }

    const tokenRecord = await VerificationService.generateToken(user.id, "PASSWORD_RESET", email);
    await EmailService.sendPasswordResetEmail(user.email, user.name, tokenRecord.token);

    return { success: true };
  }

  static async resetPassword(data: { email: string; code: string; newPassword: string }): Promise<AuthResponse> {
    const { email, code, newPassword } = data;
    
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    const tokenRecord = await VerificationService.validateToken(user.id, code, "PASSWORD_RESET");

    const password_hash = await bcrypt.hash(newPassword, 12);
    await UserService.updateUser(user.id, { password_hash });
    await VerificationService.removeToken(tokenRecord.id);

    const secret = getJwtSecret();
    const token = jwt.sign(
      { userId: user.id, role: user.role || "USER" },
      secret,
      { expiresIn: "4h" }
    );

    return {
      token,
      user: UserMapper.toPublicDTO(user),
    };
  }
}
