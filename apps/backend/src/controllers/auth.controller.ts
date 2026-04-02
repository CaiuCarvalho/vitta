import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { catchAsync } from "../utils/catchAsync";

declare global {
  namespace Express {
    export interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

export class AuthController {
  static login = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await AuthService.login(req.body);
    res.status(200).json(result);
  });

  static register = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await AuthService.register(req.body);
    res.status(201).json(result);
  });

  static forgotPassword = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    const result = await AuthService.forgotPassword(email);
    res.status(200).json(result);
  });

  static resetPassword = catchAsync(async (req: Request, res: Response): Promise<void> => {
    const result = await AuthService.resetPassword(req.body);
    res.status(200).json(result);
  });
}
