/**
 * Formata um valor numérico como moeda brasileira (BRL).
 * @example formatCurrency(99.9) => "R$ 99,90"
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Converte um texto em slug URL-friendly.
 * @example slugify("Camiseta Premium Azul") => "camiseta-premium-azul"
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}

/**
 * Mescla classnames condicionalmente (alternativa leve ao clsx).
 * @example cn("base", false && "hidden", "active") => "base active"
 */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Aguarda N milissegundos (útil para testes e debounce).
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Trunca um texto com reticências se ultrapassar o limite.
 * @example truncate("Texto longo demais", 10) => "Texto long..."
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Lógica de Frete Dinâmico (Brasil Fanfare) - Single Source of Truth
 */
export function calculateShipping(zipCode: string, subtotal: number): number {
  if (subtotal >= 170) return 0; // Frete Grátis acima de R$ 170 (Regra Oficial)
  
  const cleanZip = zipCode.replace(/\D/g, "");
  if (cleanZip.length < 2) return 27.90; // Fallback para CEP inválido

  const prefix = parseInt(cleanZip.substring(0, 2));
  
  // Capitais e Regiões Metropolitanas principais (Sudeste)
  if (prefix >= 1 && prefix <= 9) return 11.90; // Grande SP
  if (prefix >= 10 && prefix <= 39) return 19.90; // Interior SP, RJ, MG, ES
  if (prefix >= 80 && prefix <= 89) return 19.90; // PR, SC, RS
  
  // Demais regiões (Norte, Nordeste, Centro-Oeste)
  return 27.90;
}

export * from "./validation";

/* --- Shared Domain Interfaces --- */

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  taxId?: string | null;
  avatarUrl?: string | null;
  role?: string;
}

export interface ShippingAddress {
  id?: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string | null;
  neighborhood: string;
  city: string;
  state: string;
  isDefault?: boolean;
}

export interface CategoryDTO {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
}

export interface ProductDTO {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl?: string | null;
  categoryId: string;
  category?: CategoryDTO;
}

export interface OrderItemDTO {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  product?: ProductDTO;
}

export interface OrderDTO {
  id: string;
  userId: string;
  total: number;
  status: string;
  createdAt: string | Date;
  updatedAt: string | Date;
  shippedAt?: string | Date | null;
  trackingCode?: string | null;
  items?: OrderItemDTO[];
}

export interface CartItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image_url?: string;
}

export interface CheckoutPayload {
  items: CartItem[];
  addressId?: string;
  newAddress?: ShippingAddress;
  paymentMethod: "PIX" | "CARD";
  customer?: {
    phone?: string;
    taxId?: string;
  };
}
