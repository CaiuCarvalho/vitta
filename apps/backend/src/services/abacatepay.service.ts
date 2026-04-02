import "dotenv/config";
import { AppError } from "../utils/AppError";

const ABACATE_PAY_API_KEY = process.env.ABACATE_PAY_API_KEY;
if (!ABACATE_PAY_API_KEY) {
  throw new Error("FATAL: ABACATE_PAY_API_KEY environment variable is not set. Abacate Pay service cannot initialize.");
}
const BASE_URL = "https://api.abacatepay.com/v1";

// ─── DTOs ─────────────────────────────────────────────────────────────────────

export interface AbacateCustomer {
  name: string;
  email: string;
  cellphone?: string;
  taxId?: string; // CPF/CNPJ
}

export interface AbacateProduct {
  externalId: string;
  name: string;
  description?: string;
  quantity: number;
  price: number; // in cents, min 100
}

export interface CreateBillingDTO {
  frequency: "ONE_TIME" | "MULTIPLE_PAYMENTS";
  methods: ("PIX" | "CARD")[];
  products: AbacateProduct[];
  returnUrl: string;
  completionUrl: string;
  customer?: AbacateCustomer;
  customerId?: string;
}

import logger from "../utils/logger";

// ─── Service ──────────────────────────────────────────────────────────────────

export class AbacatePayService {
  private static async request<T>(endpoint: string, body: object): Promise<T> {
    if (!ABACATE_PAY_API_KEY) {
      logger.error("ABACATE_PAY_API_KEY não encontrada no ambiente!");
      throw new Error("ABACATE_PAY_API_KEY não encontrada no ambiente!");
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ABACATE_PAY_API_KEY}`,
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        logger.error(`Abacate Pay API Error [${response.status}]: %o`, data);
        throw new Error(
          data.message || data.error || `HTTP ${response.status} from Abacate Pay`
        );
      }

      return data.data ?? data;
    } catch (error: any) {
      logger.error("Erro na requisição ao Abacate Pay: %o", error);
      throw error;
    }
  }

  /**
   * Cria uma cobrança Abacate Pay (gera link de pagamento / QR Code Pix).
   */
  static async createBilling(payload: CreateBillingDTO) {
    try {
      logger.info(`Iniciando criação de cobrança Abacate Pay: ${payload.customer?.email}`);
      const billing = await this.request<any>("/billing/create", payload);
      logger.info(`Cobrança Abacate Pay criada com sucesso: ${billing.id}`);
      return billing;
    } catch (error: any) {
      throw new AppError("Erro na integração de Pagamento Abacate Pay", 500);
    }
  }
}
