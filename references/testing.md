# Testing — Agon Quality Assurance

O Agon adota uma pirâmide de testes rigorosa para garantir que o fluxo de faturamento e a integridade do estoque sejam sempre preservados.

## 1. Estratégia de Testes (Agon QA)

1.  **Testes Unitários (Vitest)**: Foco total em cálculos de preço, lógica de estoque e validações de serviço.
2.  **Testes de Integração**: Validação de endpoints críticos (`/api/auth`, `/api/payment/checkout`) com mocks do Prisma ou DB local.
3.  **Testes de Componentes (React Testing Library)**: Foco em estados complexos como o Carrinho e Auth Forms.
4.  **Testes End-to-End (Playwright)**: Simulação completa da jornada do usuário do clique à confirmação do pedido.

## 2. Como Rodar os Testes

### Na Raiz (via Turbo)
```bash
npm test          # Roda todos os testes de todas as apps e packages
npm run lint      # Validação de tipos e lint em todo o monorepo
```

### Backend Específico
```bash
cd apps/backend
npm test          # Roda unitários via Vitest
npm run build      # Valida tipos (tsc)
```

### Frontend Específico
```bash
cd apps/frontend
npm test          # Roda componentes via Jest/Vitest
npm run lint      # Roda Next.js lint
```

## 3. Testes E2E (Playwright)

Localizados na pasta `/e2e`. Eles testam os fluxos críticos:
- **Fluxo 1**: Arsenal -> Detalhes -> Adição ao Carrinho -> Checkout -> Login -> Pagamento.
- **Fluxo 2**: Admin -> Edição de Estoque -> Verificação no Catálogo.

Para rodar o Playwright:
```bash
npx playwright test
```

## 4. Políticas de Cobertura
- **Mínimo**: 70% de cobertura de linhas em arquivos de `Services` no backend.
- **Crítico**: 100% de cobertura em cálculos do `PaymentService` e `OrderService`.

## 5. Ferramentas e Configurações
- **Vitest**: Rápido, nativo para Vite/Turbo.
- **V8**: Provedor de cobertura de código.
- **Playwright Inspector**: Recomendado para depurar falhas em fluxos de checkout.

## 6. 🔒 Governança de Qualidade (QA)

### 🔒 Regras Obrigatórias
- **70% Line Coverage**: Mínimo exigido para todos os novos `Services` do backend.
- **Fulfillment Validation**: Fluxos de pagamento e faturamento **DEVEM** ter testes E2E via Playwright.
- **Zero-Lint Policy**: O build no CI deve falhar se houver erros de lint ou tipos.

### 🚫 Anti-padrões
- **Mocking the Database**: Evite mocar o Prisma em excesso; prefira um banco de dados de teste real sempre que possível.
- **Skipped Tests**: Nunca comite testes com `.skip()` ou `.only()` de forma permanente.

### ✅ Boas Práticas
- **Fail First (TDD)**: Tente escrever o teste de falha antes de implementar a correção ou feature.
- **Descriptive Naming**: Nomes de testes devem descrever o comportamento esperado, não o nome da função.

## 7. Integração Contínua (CI/CD)
O projeto agora emprega um GitHub Action de verificação contínua rigorosa (`ci.yml`):
- O Pipeline (`npm test` e `npm run test:e2e`) rodará automaticamente tanto em rotinas isoladas de unitárias até o estresse E2E de simulação de compra em *Pull Requests* visando a master.
- **Strict Break**: A fusão (Merge) estará bloqueada e não será permitida pela governança do repositório a menos que 100% da suite de testes seja declarada como "verdinha" no Github.
