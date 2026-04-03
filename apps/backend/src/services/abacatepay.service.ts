import "dotenv/config";
import { AppError } from "../utils/AppError";
import logger from "../utils/logger";

const ABACATE_PAY_API_KEY = process.env.ABACATE_PAY_API_KEY;
if (!ABACATE_PAY_API_KEY) {
  logger.warn("ABACATE_PAY_API_KEY is not set. Abacate Pay service will fail during checkout. (Mercado Pago migration in progress)");
}

const BASE_URL = "https://api.abacatepay.com/v1";

// Item 13: Timeout padrão de 15 segundos para todas as requisições
const REQUEST_TIMEOUT_MS = 15_000;

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

// ─── Payload Validator ────────────────────────────────────────────────────────

// Item 14: Validação do payload antes de enviar à API
function validateBillingPayload(payload: CreateBillingDTO): void {
  if (!payload.products || payload.products.length === 0) {
    throw new AppError("Payload inválido: lista de produtos está vazia.", 400);
  }
  if (!payload.returnUrl || !payload.completionUrl) {
    throw new AppError("Payload inválido: returnUrl e completionUrl são obrigatórios.", 400);
  }
  for (const product of payload.products) {
    if (!product.externalId || !product.name) {
      throw new AppError("Payload inválido: produto sem ID ou nome.", 400);
    }
    if (product.quantity <= 0) {
      throw new AppError(`Payload inválido: quantidade inválida para o produto "${product.name}".`, 400);
    }
    if (product.price < 100) {
      throw new AppError(
        `Payload inválido: preço mínimo é R$1,00 (100 centavos) para o produto "${product.name}".`,
        400
      );
    }
  }
}

// ─── Service ──────────────────────────────────────────────────────────────────

export class AbacatePayService {
  private static async request<T>(endpoint: string, body: object): Promise<T> {
    // Item 13: AbortController para timeout de 15 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ABACATE_PAY_API_KEY}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        // Item 15: Erro descritivo com status code e mensagem da API
        const apiMessage = data.message || data.error || "Erro desconhecido";
        logger.error(`Abacate Pay API Error [${response.status}] em ${endpoint}: ${apiMessage}`);
        throw new AppError(
          `Falha na integração Abacate Pay [${response.status}]: ${apiMessage}`,
          502
        );
      }

      return data.data ?? data;
    } catch (error: any) {
      // Item 13: Timeout tratado separadamente para mensagem clara
      if (error.name === "AbortError") {
        logger.error(`Abacate Pay: timeout após ${REQUEST_TIMEOUT_MS}ms no endpoint ${endpoint}`);
        throw new AppError(
          `Timeout na comunicação com o gateway de pagamento. Tente novamente.`,
          504
        );
      }
      // Re-throw AppErrors sem wrapping
      if (error instanceof AppError) throw error;
      // Item 15: Outros erros de rede com mensagem descritiva
      logger.error(`Abacate Pay: erro de rede em ${endpoint}: ${error.message}`);
      throw new AppError("Falha de conexão com o gateway de pagamento. Tente novamente.", 502);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Cria uma cobrança Abacate Pay (gera link de pagamento / QR Code Pix).
   */
  static async createBilling(payload: CreateBillingDTO) {
    // Item 14: Validar payload antes de fazer a requisição
    validateBillingPayload(payload);

    // Item 12: Log sem email ou dados pessoais do customer
    logger.info(
      `Iniciando criação de cobrança | produtos=${payload.products.length} | método=${payload.methods.join(",")}`
    );

    const billing = await this.request<any>("/billing/create", payload);
    logger.info(`Cobrança Abacate Pay criada com sucesso: ${billing.id}`);
    return billing;
  }
}
