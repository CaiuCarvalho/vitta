import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserService } from "./user.service";
import { AppError } from "../utils/AppError";
import { LoginDTO } from "../dtos/user.dto";
import { EmailService } from "./email.service";
import { VerificationService } from "./verification.service";
import { UserProfile } from "@vitta/utils";
import { UserMapper } from "../dtos/user.mapper";
import { prisma } from "@vitta/database";
import logger from "../utils/logger";

export interface RegisterDTO {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

// Item 11: Constantes de issuer/audience para garantir escopo correto do token
const JWT_ISSUER = "agon-backend";
const JWT_AUDIENCE = "agon-client";

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("FATAL: JWT_SECRET environment variable is not set.");
  }
  return secret;
}

// Item 6: Regex de força de senha — min 8 chars, 1 maiúscula, 1 número
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d).{8,}$/;

function validatePasswordStrength(password: string): void {
  if (!PASSWORD_REGEX.test(password)) {
    throw new AppError(
      "A senha deve ter no mínimo 8 caracteres, uma letra maiúscula e um número.",
      400
    );
  }
}

// Item 7: Normalização de email — lowercase + trim
function normalizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

export class AuthService {
  static async register(data: RegisterDTO): Promise<UserProfile> {
    // Item 7: Normalizar email
    const normalizedEmail = normalizeEmail(data.email);

    // Item 6: Validar força da senha
    validatePasswordStrength(data.password);

    const existing = await UserService.getUserByEmail(normalizedEmail);
    if (existing) {
      throw new AppError("Email já cadastrado", 409);
    }

    const password_hash = await bcrypt.hash(data.password, 12);
    const userProfile = await UserService.createUser({
      name: data.name,
      email: normalizedEmail, // Item 7: email normalizado persiste
      password_hash,
    });

    try {
      await EmailService.sendWelcomeEmail(userProfile.email, userProfile.name);
    } catch (err: any) {
      // Item 16: console.warn → logger.warn
      logger.warn("Não foi possível enviar email de boas-vindas, mas o registro foi bem-sucedido.", {
        error: err.message,
      });
    }

    return userProfile;
  }

  static async login(data: LoginDTO): Promise<AuthResponse> {
    // Item 7: Normalizar email
    const normalizedEmail = normalizeEmail(data.email);

    const user = await UserService.getUserByEmail(normalizedEmail);
    if (!user) {
      throw new AppError("E-mail ou senha inválidos", 401);
    }

    const isMatch = await bcrypt.compare(data.password, user.password_hash);
    if (!isMatch) {
      throw new AppError("E-mail ou senha inválidos", 401);
    }

    const secret = getJwtSecret();

    // Item 5: Incluir tokenVersion no payload para validação de invalidação
    // Item 11: Adicionar issuer e audience
    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role || "USER",
        tokenVersion: user.tokenVersion,
      },
      secret,
      {
        expiresIn: "7d",
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      }
    );

    return {
      token,
      user: UserMapper.toPublicDTO(user),
    };
  }

  static async forgotPassword(email: string): Promise<{ success: boolean }> {
    // Item 7: Normalizar email
    const normalizedEmail = normalizeEmail(email);
    const user = await UserService.getUserByEmail(normalizedEmail);

    if (!user) {
      return { success: true }; // Não vazar existência de email
    }

    const tokenRecord = await VerificationService.generateToken(user.id, "PASSWORD_RESET", normalizedEmail);
    await EmailService.sendPasswordResetEmail(user.email, user.name, tokenRecord.token);

    return { success: true };
  }

  static async resetPassword(data: {
    email: string;
    code: string;
    newPassword: string;
  }): Promise<AuthResponse> {
    const { code, newPassword } = data;

    // Item 7: Normalizar email
    const email = normalizeEmail(data.email);

    // Item 6: Validar força da nova senha
    validatePasswordStrength(newPassword);

    const user = await UserService.getUserByEmail(email);
    if (!user) {
      throw new AppError("Usuário não encontrado.", 404);
    }

    const tokenRecord = await VerificationService.validateToken(user.id, code, "PASSWORD_RESET");

    const password_hash = await bcrypt.hash(newPassword, 12);

    // Item 5: Incrementar tokenVersion para invalidar todos os tokens anteriores
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        password_hash,
        tokenVersion: { increment: 1 },
      },
    });

    await VerificationService.removeToken(tokenRecord.id);

    const secret = getJwtSecret();

    // Item 5: Novo token emitido com a nova versão
    // Item 11: Incluir issuer e audience
    const token = jwt.sign(
      {
        userId: updatedUser.id,
        role: updatedUser.role || "USER",
        tokenVersion: updatedUser.tokenVersion,
      },
      secret,
      {
        expiresIn: "4h",
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
      }
    );

    return {
      token,
      user: UserMapper.toPublicDTO(updatedUser),
    };
  }
}
