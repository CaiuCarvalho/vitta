import { Request, Response } from "express";
import { catchAsync } from "../utils/catchAsync";
import { AppError } from "../utils/AppError";
import { PaymentService } from "../services/payment.service";
import { CheckoutPayload } from "@vitta/utils";

/**
 * PaymentController (Brasil Fanfare)
 * Delegador de requisições de pagamento para o PaymentService.
 */
export class PaymentController {
  /**
   * POST /api/payment/checkout
   * Processa a intenção de compra e gera a cobrança no gateway.
   */
  static checkout = catchAsync(async (req: Request, res: Response) => {
    // Extrair ID do usuário do token (anexado pelo AuthMiddleware)
    const userId = (req as any).user?.userId;
    if (!userId) {
      throw new AppError("Usuário não autenticado. Por favor, faça login para continuar.", 401);
    }

    // A payload agora é validada internamente pelo Service ou via Middleware Zod futuro
    const payload: CheckoutPayload = req.body;

    // Orchestrator: Toda a lógica complexa (frete total, descontos, ordens, gateway)
    // agora reside isolada e testável no PaymentService.
    const result = await PaymentService.processCheckout(userId, payload);

    res.status(201).json({
      success: true,
      data: result,
    });
  });

  /**
   * GET /api/payment/shipping
   * Endpoint auxiliar para cálculo rápido de frete antes do checkout.
   */
  static calculateQuickShipping = catchAsync(async (req: Request, res: Response) => {
    const { zipCode, subtotal } = req.query;
    
    if (!zipCode || !subtotal) {
      throw new AppError("CEP e subtotal são obrigatórios para o cálculo.", 400);
    }

    // Reuso imediato da lógica centralizada no @vitta/utils
    const { calculateShipping } = await import("@vitta/utils");
    const cost = calculateShipping(zipCode as string, Number(subtotal));
    const freeShippingThreshold = Number(process.env.FREE_SHIPPING_THRESHOLD) || 170;

    res.status(200).json({
      success: true,
      data: { 
        shipping: cost,
        freeShippingThreshold
      },
    });
  });
}
