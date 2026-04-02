/**
 * Valida um CPF (Cadastro de Pessoa Física) brasileiro.
 */
export function validateCPF(cpf: string): boolean {
  const cleanCPF = cpf.replace(/\D/g, "");
  if (cleanCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanCPF)) return false;
  const digits = cleanCPF.split("").map(Number);
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += digits[i] * (10 - i);
  let remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== digits[9]) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += digits[i] * (11 - i);
  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) remainder = 0;
  if (remainder !== digits[10]) return false;
  return true;
}

/**
 * Valida um CNPJ (Cadastro Nacional da Pessoa Jurídica) brasileiro.
 */
export function validateCNPJ(cnpj: string): boolean {
  const cleanCNPJ = cnpj.replace(/\D/g, "");
  if (cleanCNPJ.length !== 14 || /^(\d)\1{13}$/.test(cleanCNPJ)) return false;
  const digits = cleanCNPJ.split("").map(Number);
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
  if (!taxId) return false;
  const clean = taxId.replace(/\D/g, "");
  if (clean.length === 11) return validateCPF(clean);
  if (clean.length === 14) return validateCNPJ(clean);
  return false;
}
