# Database — Agon Schema & Relations

O Agon utiliza o **PostgreSQL** através do **Prisma ORM**, mantendo uma estrutura de dados relacional e normalizada para um e-commerce de alto desempenho.

## 1. Diagrama de Entidades (Entity Relationship)

```mermaid
erDiagram
    USER ||--o{ ADDRESS : "has"
    USER ||--o{ ORDER : "places"
    USER ||--o{ WISHLIST_ITEM : "saves"
    USER ||--o{ VERIFICATION_TOKEN : "uses"
    CATEGORY ||--o{ PRODUCT : "contains"
    PRODUCT ||--o{ ORDER_ITEM : "belongs to"
    ORDER ||--o{ ORDER_ITEM : "contains"
    PRODUCT ||--o{ WISHLIST_ITEM : "belongs to"

    USER {
        string id PK
        string name
        string email UK
        string password_hash
        enum Role role
        datetime created_at
    }

    PRODUCT {
        string id PK
        string name
        float price
        int stock
        string image_url
        string category_id FK
    }

    ORDER {
        string id PK
        string user_id FK
        float total
        enum OrderStatus status
        string tracking_code
        string abacate_billing_id
    }
```

## 2. Tabelas e Responsabilidades

### users
- Armazena credenciais e permissões (`USER` / `ADMIN`).
- O relacionamento com `WishlistItem` é limitado a 20 entradas via regra de negócio no service.

### addresses
- Cadastro de múltiplos endereços por usuário.
- O campo `isDefault` determina o endereço pré-carregado no checkout.

### categories & products
- Estrutura base da vitrine.
- Relacionamento 1:N entre categoria e produto.

### orders & order_items
- Representam as transações.
- `Order` armazena o cabeçalho (total, status, cliente).
- `OrderItem` armazena a foto do momento da compra (quantidade e preço da época).

### verification_tokens
- Gerenciamento de códigos `OTP` para recuperação de senha e alteração de e-mail.
- Possuem tempo de expiração (`expires_at`).

## 3. Enums e Estados

### OrderStatus
- `PENDING`: Aguardando pagamento.
- `PAID`: Confirmado via Webhook.
- `SHIPPED`: Enviado com código de rastreio.
- `DELIVERED`: Entregue.
- `CANCELLED/FAILED`: Pagamento recusado ou pedido expirado.

## 4. Estratégia de Migrações
- As alterações no schema devem ser feitas em `packages/database/prisma/schema.prisma`.
- Novos modelos devem ser seguidos por `npx prisma migrate dev` para gerar as migrações SQL.

## 5. Integridade de Dados
- **Cascade Delete**: Em endereços e itens de carrinho, garantir que a exclusão do usuário ou pedido não deixe registros órfãos.
- **Unique Constraints**: Bloqueio de duplicidade de e-mails e favoritos.

## 6. 🔒 Governança de Dados

### 🔒 Regras Obrigatórias
- **Migrations only**: Jamais modifique o banco manualmente. Use `Prisma Migrate`.
- **Schema sync**: Qualquer alteração no schema deve ser refletida nos Mappers correspondentes.
- **Safe Seeds**: O `seed.ts` deve ser idempotente (usar `upsert` em vez de `create`).

### 🚫 Anti-padrões
- **Cascade perigoso**: Evite `onDelete: Cascade` em tabelas fundamentais (ex: `Product`) sem auditoria.
- **N + 1 Queries**: Sempre utilize `include` ou `select` de forma otimizada para evitar múltiplas chamadas ao banco em loops.

### ✅ Boas Práticas
- **Naming Convention**: Use `camelCase` para campos e `snake_case` para nomes de tabelas no `@map`.
- **Indexing Strategy**: Indexe campos de busca frequente (`email`, `status`, `abacateBillingId`).
