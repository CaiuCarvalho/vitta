# 🧠 Claude System Context — Projeto Vitta

## 🏗️ Visão Geral da Arquitetura

O projeto Vitta será estruturado como um e-commerce moderno baseado em arquitetura modular, com separação clara entre frontend, backend e serviços auxiliares.

### Arquitetura:

* Frontend desacoplado (SPA / SSR híbrido)
* Backend baseado em API (REST ou RPC)
* Integração com serviços externos (pagamento, analytics)
* Estrutura escalável e orientada a componentes

### Identidade Visual e Foco de Negócio:
* **Foco:** Produtos premium com estética feminina voltada para cuidados capilares de luxo (Luxe Hair Sanctuary).

### Fluxo:

Usuário → Frontend → API → Serviços → Banco de Dados

---

## ⚙️ Stack Tecnológico Completo

### Frontend

* React
* Next.js
* Tailwind CSS
* Framer Motion
* Shadcn UI & Radix Primitives
* ShaderGradient (Background Animado)
* Lucide React

### Backend

* Node.js
* API REST (Express + TypeScript)

### Banco de Dados

* PostgreSQL
* Prisma ORM

### Autenticação

* JWT ou NextAuth

### Pagamentos

* Stripe ou Mercado Pago

### Infraestrutura

* Vercel (frontend)
* Railway / Render (backend)
* Cloudflare (CDN e segurança)

### Analytics

* Google Analytics
* Hotjar

---

## 🔐 Variáveis de Ambiente

```
DATABASE_URL=
NEXT_PUBLIC_API_URL=
JWT_SECRET=

STRIPE_PUBLIC_KEY=
STRIPE_SECRET_KEY=

MERCADO_PAGO_ACCESS_TOKEN=

NEXTAUTH_SECRET=
NEXTAUTH_URL=

CLOUDINARY_URL=

GOOGLE_ANALYTICS_ID=
HOTJAR_ID=
```

---

## 📁 Estrutura de Diretórios

O projeto utiliza **Turborepo** para gerenciar o monorepo.

```
/vitta
  /apps
    /frontend (Next.js)
    /backend (Express: controllers, routes, services)

  /packages
    /config
    /database (Prisma ORM)
    /ui
    /utils

  /content
    /products
    /categories
    /testimonials

  /services
    /payment
    /auth
    /analytics

  /jobs
    /emails
    /cleanup
    /reports

  /models
    /user
    /product
    /order

  /public
  /styles
```

---

## 🧩 Serviços, Jobs e Models

### Services

* AuthService → login, registro, tokens
* ProductService → listagem e busca
* OrderService → criação de pedidos
* PaymentService → integração com gateway
* AnalyticsService → eventos

### Jobs

* EmailJob → envio de confirmação de compra
* CleanupJob → limpar carrinhos abandonados
* ReportJob → relatórios de vendas

### Models

#### User

* id
* name
* email
* password_hash
* createdAt / updatedAt

#### Category

* id
* slug
* name
* description
* createdAt / updatedAt

#### Product

* id
* name
* description
* price
* imageUrl
* categoryId
* createdAt / updatedAt

#### Order

* id
* userId
* total
* status (PENDING, PAID, SHIPPED, DELIVERED, CANCELLED)
* createdAt / updatedAt

#### OrderItem

* id
* orderId
* productId
* quantity
* unitPrice
* createdAt

---

## ⚠️ Common Hurdles (Problemas comuns + soluções)

1. Imagens pesadas → usar compressão + CDN
2. Site lento → SSR + caching
3. Checkout abandonado → reminders automáticos
4. API lenta → indexação no banco
5. Erros de pagamento → fallback de gateway
6. Responsividade ruim → mobile-first
7. SEO fraco → meta tags dinâmicas
8. Dados inconsistentes → validação backend
9. Falha em deploy → CI/CD automatizado
10. Bugs em produção → logging (Sentry)
11. Falta de conversão → otimização de CTA
12. Layout quebrado → design system padronizado

---

## 🧠 Design Patterns Utilizados

1. MVC
2. Component-Based Architecture
3. Repository Pattern
4. Service Layer Pattern
5. Factory Pattern
6. Singleton Pattern
7. Observer Pattern
8. Strategy Pattern
9. Adapter Pattern
10. Dependency Injection
11. Middleware Pattern
12. Atomic Design
13. Lazy Loading
14. Separation of Concerns

---

## 📆 Pipeline Semanal

### Segunda

09:00 — Planejamento
10:00 — Definição de tasks
14:00 — Setup técnico

### Terça

09:00 — Desenvolvimento frontend
14:00 — Integração API

### Quarta

09:00 — Backend
14:00 — Banco de dados

### Quinta

09:00 — Integrações (pagamento, auth)
14:00 — Testes

### Sexta

09:00 — Ajustes UI/UX
14:00 — Otimização performance

### Sábado

10:00 — Revisão geral
14:00 — Deploy staging

### Domingo

OFF / análise estratégica

---

## ✅ Checklist Pós-Implementação

* [ ] Responsividade validada
* [ ] Testes de compra completos
* [ ] Integração de pagamento funcionando
* [ ] SEO básico configurado
* [ ] Performance otimizada (Lighthouse)
* [ ] Analytics ativo
* [ ] Segurança validada
* [ ] Logs funcionando
* [ ] Deploy em produção
* [ ] Backup configurado

---

## 🚀 Diretriz Final para Claude

Sempre priorizar:

* Código limpo e escalável
* Performance
* Experiência do usuário
* Estrutura reutilizável
* Clareza e organização

Evitar:

* Código duplicado
* Overengineering
* Layout poluído

Objetivo final:
Construir um e-commerce premium, rápido, moderno e altamente conversivo.
