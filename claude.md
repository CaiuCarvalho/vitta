# 🧠 Claude System Context — Agon Experience

Este documento é a **Bússola de Estratégia** do projeto Agon. Ele serve como o ponto de entrada principal para entender o propósito, a marca e a fundação tecnológica da plataforma.

Para detalhes técnicos profundos, consulte o nosso [Ecossistema de Referências](/references).

---

## 🎯 Visão do Produto
O Agon é a boutique oficial da **Agon**, uma experiência premium de artigos da Seleção Brasileira (Nike/CBF Style). O objetivo é transformar a compra em um ato de elite, unindo alta performance, design agressivo e paixão nacional.

### 📚 Guia de Referência Rápida
> [!IMPORTANT]
> **REGRA DE OURO**: Nenhuma implementação deve ser feita sem antes consultar a pasta `/references`. Toda decisão técnica complexa deve ser justificada com base no [Framework de Decisões](/references/decision-framework.md) e seguir o [Fluxo do Agente](/references/agent-workflow.md).

Toda a documentação técnica detalhada reside na pasta [`/references`](/references):

| Assunto | Referência Detalhada | Governança (🔒/🚫) |
| :--- | :--- | :--- |
| **Arquitetura** | [architecture.md](/references/architecture.md) | 🔒 SOC, 🚫 DB no Front |
| **Design System** | [design-system.md](/references/design-system.md) | 🔒 HSL Tokens, 🚫 Cores soltas |
| **Frontend** | [frontend.md](/references/frontend.md) | 🔒 App Router, 🚫 Any, ✅ Skeletons |
| **Backend Core** | [backend.md](/references/backend.md) | 🔒 catchAsync, 🚫 Plaintext |
| **Modelo de Dados** | [database.md](/references/database.md) | 🔒 Migrations, 🚫 N+1 Queries |
| **Workflows** | [workflows.md](/references/workflows.md) | 🔒 Atomic Ops, 🔒 Webhooks |
| **Segurança** | [security.md](/references/security.md) | 🔒 Bcrypt, 🔒 Shared Secrets |
| **Decisões** | [decision-framework.md](/references/decision-framework.md) | **Framework de Escolhas** |
| **Fluxo Agente** | [agent-workflow.md](/references/agent-workflow.md) | **Como o Agente Atua** |
| **Validação** | [validation-rules.md](/references/validation-rules.md) | **Checklist de Entrega** |
| **Glossário** | [glossary.md](/references/glossary.md) | Linguagem Ubíqua |

---

## 🛠️ Fundação Tecnológica (Stack)
- **Frontend**: Next.js (App Router), React, Tailwind, Framer Motion.
- **Backend**: Node.js, Express, TypeScript.
- **Database**: PostgreSQL via Prisma ORM (`@vitta/database`).
- **Pagamentos**: Abacate Pay (Checkout Inteligente).
- **Comunicações**: Resend (Emails transacionais TSX).

---

## 🛡️ Regras Invioláveis de Arquitetura (CRÍTICO)
1.  **SOC (Separação de Contexto)**: O frontend nunca toca no banco. Toda lógica crítica reside em `Services` no Backend.
2.  **Segurança de Transação**: A única fonte da verdade para pagamentos é o **Webhook Seguro**. Nunca confie no frontend para confirmação.
3.  **Tipagem Estrita**: Nenhuma interação backend/banco de dados ou backend/frontend deve usar `any`. Use **DTOs** e **Mappers** em `@vitta/utils`.
4.  **Validação Rígida**: Todo input externo (Body, Query, Params) deve passar por schemas **Zod** no middleware de validação.
5.  **Aestética Premium**: Falha em manter o design "Elite Nike Dark" é inaceitável. Use [design-system.md](/references/design-system.md) como guia.

---

## 🚀 Pipeline de Desenvolvimento
1.  **Audit**: Verifique se a mudança afeta o fluxo de faturamento.
2.  **Schema**: Se houver alteração de dados, comece pelo `schema.prisma`.
3.  **Services**: Implemente a lógica pura no backend.
4.  **API**: Crie a rota e o controlador tipado.
5.  **Frontend**: Crie a UI com skeletons e animações.
6.  **Verify**: Execute `npm test` e `npx playwright test`.

---
*Para dúvidas sobre termos de domínio (ex: "Arsenal", "Elite Checkout"), consulte o [Glossário](/references/glossary.md).*
es de Componentes (React Testing Library)**:
    *   Foco em componentes de estado: `Cart`, `CheckoutForm`, `AuthForm`.
    *   Mocks de hooks do Next.js (`useRouter`, `useSearchParams`).
4.  **Testes End-to-End (Playwright)**:
    *   **Fluxo Crítico 1**: Descoberta (Busca) -> Adição ao Carrinho -> Checkout -> Login -> Pagamento (Simulação).
    *   **Fluxo Crítico 2**: Admin -> Edição de Estoque -> Verificação no Catálogo Público.
5.  **Políticas de Qualidade**:
    *   **Cobertura**: Mínimo de **70%** de cobertura de linhas em arquivos de `Services`.
    *   **CI/CD**: Testes devem rodar em todo Pull Request via Turbo Pipeline.
