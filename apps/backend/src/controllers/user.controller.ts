import { Request, Response } from "express";
import { UserService } from "../services/user.service";
import { AuthService } from "../services/auth.service";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";

interface AuthenticatedRequest extends Request {
  auth: {
    userId: string;
    role: string;
  };
}

const MAX_PAGE_LIMIT = 100;

export class UserController {
  /**
   * ADMIN only: Get a paginated list of all users
   */
  static getUsers = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const page = Math.max(1, parseInt(req.query.page as string || "1"));
    const limit = Math.min(MAX_PAGE_LIMIT, Math.max(1, parseInt(req.query.limit as string || "20")));

    const result = await UserService.getAllUsers(page, limit);
    res.status(200).json(result);
  });

  /**
   * Get target user by ID. 
   * Admins can view any user, regular users can only view themselves.
   */
  static getUserById = catchAsync(async (req: any, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    if (authReq.auth.role !== "ADMIN" && authReq.auth.userId !== req.params.id) {
      throw new AppError("Acesso negado: você só pode visualizar seu próprio perfil", 403);
    }

    const user = await UserService.getUserById(req.params.id);
    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    res.status(200).json(user);
  });

  /**
   * Public: Register a new user
   */
  static createUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;
    const user = await AuthService.register({ name, email, password });

    res.status(201).json({
      message: "Usuário criado com sucesso",
      user,
    });
  });

  /**
   * Self: Update own profile data
   */
  static updateProfile = catchAsync(async (req: any, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.auth.userId;
    const updatedUser = await UserService.updateProfile(userId, req.body);

    res.status(200).json({
      message: "Perfil atualizado com sucesso",
      user: updatedUser,
    });
  });

  /**
   * Self: Add a new shipping address
   */
  static addAddress = catchAsync(async (req: any, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.auth.userId;
    const address = await UserService.addAddress(userId, req.body);

    res.status(201).json({
      message: "Endereço adicionado com sucesso",
      address,
    });
  });

  /**
   * Self: Request to update sensitive data (Email or CPF/TaxID)
   */
  static requestUpdate = catchAsync(async (req: any, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.auth.userId;
    const { type, newValue } = req.body;

    const result = await UserService.requestUpdate(userId, type, newValue);
    res.status(200).json(result);
  });

  /**
   * Self: Confirm update of sensitive data via OTP token
   */
  static confirmUpdate = catchAsync(async (req: any, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.auth.userId;
    const { token, type } = req.body;

    const result = await UserService.confirmUpdate(userId, token, type);
    res.status(200).json(result);
  });

  /**
   * Self: Update password
   */
  static updatePassword = catchAsync(async (req: any, res: Response): Promise<void> => {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.auth.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await UserService.updatePassword(userId, currentPassword, newPassword);
    res.status(200).json({
      message: "Senha atualizada com sucesso",
      user,
    });
  });

  /**
   * ADMIN only: Update any user data
   */
  static updateUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const updatedUser = await UserService.updateProfile(req.params.id, req.body);
    res.status(200).json({
      message: "Usuário atualizado com sucesso",
      user: updatedUser,
    });
  });

  /**
   * ADMIN only: Delete a user
   */
  static deleteUser = catchAsync(async (req: Request, res: Response): Promise<void> => {
    await UserService.deleteUser(req.params.id);
    res.status(204).send();
  });
}
