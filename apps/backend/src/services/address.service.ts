import { prisma } from "@vitta/database";

export interface CreateAddressDTO {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault?: boolean;
}

export interface UpdateAddressDTO {
  street?: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  isDefault?: boolean;
}

export class AddressService {
  static async getUserAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }

  static async addAddress(userId: string, data: CreateAddressDTO) {
    return prisma.$transaction(async (tx) => {
      // If marked as default, unset all others first
      if (data.isDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      const existingCount = await tx.address.count({ where: { userId } });
      const isFirst = existingCount === 0;

      return tx.address.create({
        data: {
          street: data.street,
          number: data.number,
          complement: data.complement,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          userId,
          isDefault: data.isDefault || isFirst,
        },
      });
    });
  }

  static async updateAddress(id: string, userId: string, data: UpdateAddressDTO) {
    // Verify ownership first
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      throw new Error("Address not found or access denied");
    }

    return prisma.$transaction(async (tx) => {
      if (data.isDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      return tx.address.update({
        where: { id },
        data: {
          street: data.street,
          number: data.number,
          complement: data.complement,
          neighborhood: data.neighborhood,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          isDefault: data.isDefault,
        },
      });
    });
  }

  static async deleteAddress(id: string, userId: string) {
    // Verify ownership first
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      throw new Error("Address not found or access denied");
    }

    return prisma.address.delete({
      where: { id },
    });
  }

  static async setDefaultAddress(id: string, userId: string) {
    // Verify ownership first
    const existing = await prisma.address.findUnique({ where: { id } });
    if (!existing || existing.userId !== userId) {
      throw new Error("Address not found or access denied");
    }

    return prisma.$transaction(async (tx) => {
      await tx.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      });

      return tx.address.update({
        where: { id },
        data: { isDefault: true },
      });
    });
  }
}
