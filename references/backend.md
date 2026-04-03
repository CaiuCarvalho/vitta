# Backend — Agon API Core

A API do Agon é construída para segurança, performance e escalabilidade, utilizando **Express** com **TypeScript** e **Prisma**.

## 1. Stack Tecnológica

- **Node.js + Express**: Servidor robusto e flexível.
- **TypeScript**: Tipagem estrita em todo o fluxo.
- **Prisma**: ORM para PostgreSQL.
- **Zod**: Schemas de validação rigorosos.
- **JWT**: Autenticação sem estado.
- **Resend**: Comunicação de e-mail transacional.
- **Abacate Pay**: Gateway de pagamentos Pixel-perfect.

## 2. Camada de Responsabilidades

### Routers (`/routes`)
Mapeiam os endpoints HTTP e aplicam os middlewares necessários (`authMiddleware`, `adminMiddleware`, `validate`).

### Middlewares (`/middlewares`)
- **auth.middleware.ts**: Extrai e valida o token JWT de `headers.authorization`. O payload é injetado em `req.auth`.
- **validate.middleware.ts**: Valida `req.body`, `req.params` ou `req.query` contra um schema Zod.
- **error.middleware.ts**: Captura erros (exceções globais) e retorna uma Resposta JSON padronizada (`{ success: false, error: "..." }`).

### Controllers (`/controllers`)
Recebem a requisição validadas, chamam um ou mais `Services` para executar a lógica e retornam a resposta ao cliente.
- **Regra de Ouro**: Controllers nunca executam lógica de negócio ou queries SQL diretamente.

### Services (`/services`)
Contém o "coração" da aplicação. Fazem manipulações complexas de dados, calculam preços, descontos, estoques e chamam integrações externas.

### Mappers & DTOs (`/dtos`, `/packages/utils`)
- **DTOs**: Definem o contrato de entrada e saída.
- **Mappers**: Transformam e filtram os modelos Prisma em DTOs prontos para o cliente, ocultando senhas (`password_hash`) e metadados internos.

## 3. Tratamento de Erros e Exceções

Utilizamos a classe `AppError` para lançar erros controlados:
```typescript
throw new AppError("Produto não encontrado", 404);
```
Todos os controladores são envolvidos pela função utilitária `catchAsync` para evitar blocos repetitivos de `try/catch`.

## 4. Segurança de Requisição
As rotas administrativas são protegidas pelo `adminMiddleware`, que exige o campo `role: ADMIN` presente no payload do token assinado.

## 5. Padrão de Resposta Unificado

Toda resposta API Agon Segue o Padrão:
```json
{
  "success": true,
  "data": { ... },
  "message": "...",
  "error": null
}
```
Em caso de erro:
```json
{
  "success": false,
  "message": "Ops! Algo deu errado",
  "error": "Descrição detalhada do erro para o log"
}
```

## 6. 🔒 Governança do Backend

### 🔒 Regras Obrigatórias
- **Zero code-leak**: Nunca retorne modelos Prisma diretamente. Use Mappers.
- **Async Safety**: Todos os métodos de controladores devem usar `catchAsync` e retornar `Promise<void>`.
- **Strict Typing**: É proibido o uso de `any`. Use DTOs locais ou de `@vitta/utils`.
- **Validation-First**: Nenhum service deve ser chamado sem validação prévia via Zod Schema.

### 🚫 Anti-padrões
- **Queries no Service**: Evitar queries complexas soltas; use o repositório Prisma quando a lógica for de dados puramente.
- **Log sem contexto**: Não use `console.log`. Utilize o `logger` de `/utils` (se disponível) ou padrão Winston.

### ✅ Boas Práticas
- **Single Responsibility**: Cada Service deve lidar com apenas um domínio (Ex: `UserService` não cria `Orders`).
- **Standardized Error**: Use `AppError(message, status)` para feedback consistente ao frontend.
