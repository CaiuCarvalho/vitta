import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { UserService } from "../services/user.service";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

export class UserController {
  static getUsers = catchAsync(async (_req: Request, res: Response) => {
    const users = await UserService.getAllUsers();
    res.status(200).json({ data: users });
  });

  static getUserById = catchAsync(async (req: Request, res: Response) => {
    const user = await UserService.getUserById(req.params.id);
    if (!user) {
      throw new AppError("User not found", 404);
    }
    res.status(200).json({ data: user });
  });

  static createUser = catchAsync(async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      throw new AppError("Missing required fields: name, email, and password", 400);
    }

    const existing = await UserService.getUserByEmail(email);
    if (existing) {
      throw new AppError("Email already in use", 409);
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await UserService.createUser({ name, email, password_hash });
    res.status(201).json({ data: user });
  });

  static updateUser = catchAsync(async (req: Request, res: Response) => {
    const user = await UserService.updateUser(req.params.id, req.body);
    res.status(200).json({ data: user });
  });

  static deleteUser = catchAsync(async (req: Request, res: Response) => {
    await UserService.deleteUser(req.params.id);
    res.status(204).send();
  });
}

