import { Request, Response } from "express";
import { AddressService } from "../services/address.service";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

export class AddressController {
  static getMyAddresses = catchAsync(async (req: Request, res: Response) => {
    // Use authenticated user's ID — not URL param
    const userId = req.user!.userId;
    const addresses = await AddressService.getUserAddresses(userId);
    res.status(200).json({ data: addresses });
  });

  static addAddress = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const { street, number, complement, neighborhood, city, state, zipCode, isDefault } = req.body;

    if (!street || !number || !neighborhood || !city || !state || !zipCode) {
      throw new AppError("All fields are required except complement", 400);
    }

    const address = await AddressService.addAddress(userId, {
      street, number, complement, neighborhood, city, state, zipCode, isDefault,
    });
    res.status(201).json({ data: address });
  });

  static updateAddress = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const addressId = req.params.id;

    // Whitelist allowed fields
    const { street, number, complement, neighborhood, city, state, zipCode, isDefault } = req.body;

    const address = await AddressService.updateAddress(addressId, userId, {
      street, number, complement, neighborhood, city, state, zipCode, isDefault,
    });
    res.status(200).json({ data: address });
  });

  static deleteAddress = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    await AddressService.deleteAddress(req.params.id, userId);
    res.status(204).send();
  });

  static setDefaultAddress = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const address = await AddressService.setDefaultAddress(req.params.id, userId);
    res.status(200).json({ data: address });
  });
}
