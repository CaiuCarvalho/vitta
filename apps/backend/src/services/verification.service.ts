import { prisma } from "@vitta/database";
import crypto from "crypto";
import { AppError } from "../utils/AppError";

export class VerificationService {
  /**
   * Generates a 6-digit numeric token and saves it to the database.
   * Valid for 15 minutes.
   */
  static async generateToken(userId: string, type: 'EMAIL_UPDATE' | 'TAXID_UPDATE' | 'PASSWORD_RESET', newValue: string) {
    // Expire/Delete any previous tokens of the same type for this user
    await prisma.verificationToken.deleteMany({
      where: { userId, type }
    });

    const token = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    return prisma.verificationToken.create({
      data: {
        userId,
        token,
        type,
        newValue,
        expiresAt
      }
    });
  }

  /**
   * Validates a token and returns the pending new value.
   * Throws Error if invalid or expired.
   */
  static async validateToken(userId: string, token: string, type: 'EMAIL_UPDATE' | 'TAXID_UPDATE' | 'PASSWORD_RESET') {
    const record = await prisma.verificationToken.findFirst({
      where: {
        userId,
        token,
        type,
        expiresAt: { gt: new Date() }
      }
    });

    if (!record) {
      throw new AppError("Código inválido ou expirado.", 400);
    }

    return record;
  }

  /**
   * Removes tokens after successful use.
   */
  static async removeToken(tokenId: string) {
    return prisma.verificationToken.delete({
      where: { id: tokenId }
    });
  }
}
