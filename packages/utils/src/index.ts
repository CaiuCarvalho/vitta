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
