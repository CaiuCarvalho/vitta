/**
 * Valida um CPF (Cadastro de Pessoa Física) brasileiro.
 * @param cpf String contendo o CPF (com ou sem máscara)
 * @returns true se o CPF for válido, false caso contrário
 */
export function validateCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, "");

  // Deve ter 11 dígitos e não ser uma sequência repetida
  if (cleanCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanCPF)) {
    return false;
  }

  const digits = cleanCPF.split("").map(Number);

  // Validação do primeiro dígito verificador
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += digits[i] * (10 - i);
  }
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== digits[9]) return false;

  // Validação do segundo dígito verificador
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += digits[i] * (11 - i);
  }
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== digits[10]) return false;

  return true;
}

/**
 * Valida um CNPJ (Cadastro Nacional da Pessoa Jurídica) brasileiro.
 * @param cnpj String contendo o CNPJ (com ou sem máscara)
 */
export function validateCNPJ(cnpj: string): boolean {
  const cleanCNPJ = cnpj.replace(/\D/g, "");

  if (cleanCNPJ.length !== 14 || /^(\d)\1{13}$/.test(cleanCNPJ)) {
    return false;
  }

  const digits = cleanCNPJ.split("").map(Number);

  // Validação do primeiro dígito
  let size = 12;
  let numbers = cleanCNPJ.substring(0, size);
  let sum = 0;
  let pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += Number(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== digits[12]) return false;

  // Validação do segundo dígito
  size = 13;
  numbers = cleanCNPJ.substring(0, size);
  sum = 0;
  pos = size - 7;
  for (let i = size; i >= 1; i--) {
    sum += Number(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== digits[13]) return false;

  return true;
}

/**
 * Valida CPF ou CNPJ.
 */
export function validateTaxId(taxId: string): boolean {
  const clean = taxId.replace(/\D/g, "");
  if (clean.length === 11) return validateCPF(clean);
  if (clean.length === 14) return validateCNPJ(clean);
  return false;
}
