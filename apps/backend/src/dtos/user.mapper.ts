import { User } from "@vitta/database";
import { UserProfile } from "@vitta/utils";

export class UserMapper {
  /**
   * Remove ativamente dados sensíveis que o Prisma poderia vazar acidentalmente
   * ou que não devem flutuar em retornos de API.
   */
  static toPublicDTO(user: User): UserProfile {
    if (!user) return null as any;
    
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      taxId: user.taxId,
      avatarUrl: user.avatarUrl,
      role: user.role
    };
  }

  static toPublicDTOList(users: User[]): UserProfile[] {
    return users.map(user => this.toPublicDTO(user));
  }
}
