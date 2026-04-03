# Cleanup & Security Report
**Data da Auditoria**: Abril 2026

## 1. Arquivos Removidos (Limpeza)
Foram identificados e removidos arquivos temporários e scripts de testes manuais que não possuem mais finalidade na arquitetura (substituídos por testes E2E com Playwright e unitários no Vitest).

- ❌ `scripts/check-products.ts` (Script solto de verificação)
- ❌ `apps/backend/scripts/test-abacate.ts` (Testes isolados antigos)
- ❌ `apps/backend/scripts/test-e2e-checkout.ts` (Testes iterativos manuais)
- ❌ `apps/backend/scripts/test-resend.ts` (Teste manual de email)

> [!NOTE]
> Os seeders locais continuam ativos para popular o banco em dev de maneira previsível.

## 2. Correções de Segurança (Patches Aplicados)

| Vulnerabilidade | Arquivo Algodoado | Risco | Correção |
| :--- | :--- | :--- | :--- |
| **Credencial Hardcoded** | `reset-admin.ts` | 🔴 **Crítico** | Nova lógica obriga a injestão de `process.env.ADMIN_PASSWORD`, falhando o processo em sua ausência. A senha estática `admin123` foi erradicada. |
| **Ausência de Env Validation** | `index.ts` / `env.validate.ts` | 🟠 **Médio** | Implementado `Zod` Validation explícito. Se o gateway iniciar sem as chaves sensíveis exigidas (JWT, chaves do Abacate Pay), a subida será bloqueada. |

## 3. Melhorias Adicionais (Extra)

A análise validou a presença do `helmet` e `express-rate-limit` já instalados no `app.ts` do backend.
Isso cobre as recomendações extras de:
1. **Middleware de Segurança** (Headers e Proteção contra XSS) → Coberto por `helmet()`.
2. **Proteção Rate Limiters** → Proteção de Brute Force ativa na rota de login `/api/auth/login`.

## 4. Recomendações e Sugestões Futuras
- **Rotação de Keys**: Certifique-se de girar os tokens do `JWT_SECRET` e webhook keys de produção a cada 6 meses, pois referências de teste passadas possuíam hashes amostrais.
- **Validação de Variáveis no Frontend**: A recomendação se estende para aplicar um padrão parecido no Next.js (com o Zod) validando variáveis que possuem o prefixo `NEXT_PUBLIC_` durante o build time.
