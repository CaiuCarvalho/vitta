# Arquitetura Técnica — Agon Experience

O Agon utiliza uma arquitetura de **Monorepo Híbrido** gerenciada pelo **Turborepo**, garantindo que o código seja compartilhado eficientemente entre o Frontend e o Backend enquanto mantém um isolamento de domínios.

## 1. Estrutura do Monorepo

O repositório está organizado em `apps` (aplicações finais) e `packages` (bibliotecas de apoio):

```text
/agon
  ├── apps/
  │   ├── frontend/        # Next.js (App Router) — O Cliente Elite
  │   └── backend/         # Express (TypeScript) — O Motor de Negócios
  ├── packages/
  │   ├── database/        # Prisma Schema & Client (@vitta/database)
  │   ├── utils/           # DTOs, Mappers, Validadores (@vitta/utils)
  │   ├── config/          # Configurações de Lint/TS/Build
  │   └── ui/              # Componentes React compartilhados (se aplicável)
  └── e2e/                 # Testes de Ponta a Ponta (Playwright)
```

## 2. Fluxo de Dados e Comunicação

O fluxo de dados segue uma linha rigorosa de "Single Source of Truth":

1.  **Requisição (Frontend)**: O usuário interage com a UI Next.js. O frontend nunca toca no banco diretamente.
2.  **API Gateway (Express)**: O Backend recebe a requisição, passa por middlewares de segurança (JWT, Admin, Rate Limit).
3.  **Validação (Zod)**: O `validate.middleware.ts` garante que o corpo da requisição condiz com o DTO esperado.
4.  **Service Layer**: O Controller delega a lógica para um `Service`. É aqui que as regras de negócio residem.
5.  **Data Access (Prisma)**: O Service utiliza o `@vitta/database` para persistir dados no PostgreSQL.
6.  **Resposta**: O Service retorna dados, o Controller utiliza um **Mapper** para transformar o modelo Prisma em um DTO seguro e o envia ao Frontend.

## 3. Padrões Arquiteturais (SoC)

### Separação de Responsabilidades (SOC)
- **Controllers**: Apenas recebem `req`, chamam `Service`, retornam `res`.
- **Services**: Onde a "mágica" acontece. Validações de negócio, cálculos, chamadas externas.
- **DTOs (Data Transfer Objects)**: Definem exatamente o que entra e o que sai.
- **Mappers**: Garantem que senhas e dados sensíveis do Prisma nunca cheguem ao Frontend.

## 5. 🔒 Regras de Governança (Must-Follow)

### 🔒 Regras Obrigatórias
- **SOC Estrito**: O Frontend nunca deve possuir lógica de banco de dados ou segredos de API.
- **Single Source of Truth**: Toda manipulação de dados deve passar pela `Service Layer` do Backend.
- **Workflow de Decisão**: Antes de qualquer implementação, consulte `/references/decision-framework.md`.

### 🚫 Anti-padrões
- **Bypass de API**: Tentar acessar o Prisma diretamente de `apps/frontend`.
- **Lógica no Controller**: Injetar regras de negócio, cálculos ou queries diretamente nos controladores Express.
- **Hardcoded URLs**: Usar URLs de API diretamente no código sem o prefixo `process.env.NEXT_PUBLIC_API_URL`.

### ✅ Boas Práticas
- **DRY (Don't Repeat Yourself)**: Utilize os pacotes `@vitta/utils` para compartilhar lógica e tipos entre apps.
- **Fail Fast**: Valide inputs no middleware antes de qualquer processamento pesado.
