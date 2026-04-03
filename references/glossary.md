# Glossary — Agon Shared Language (Ubiquitous Language)

Este glossário define termos de negócio e técnicos fundamentais para o ecossistema Agon, garantindo que o time fale a mesma língua.

## 1. Termos de Negócio (E-commerce Agon)

- **Arsenal**: O catálogo completo de produtos (camisas, acessórios, etc).
- **Elite Checkout**: O fluxo de finalização de compra inteligente e ultra-rápido.
- **Smart Data Detection**: Capacidade do checkout de identificar campos pendentes no perfil do usuário.
- **Agon Wow**: Princípios de design de alto impacto visual (HD, Micro-animações).
- **Logo Flight**: O efeito de transição compartilhada do logotipo Agon entre páginas.
- **Classic Avatars**: Fotos de lendas da Seleção Brasileira disponíveis como escolha padrão de perfil.

## 2. Termos Técnicos (Engenharia Agon)

- **DTO (Data Transfer Object)**: Objeto que define exatamente o contrato de entrada/saída de uma API.
- **Mapper**: Função ou classe que transforma um modelo Prisma em um DTO seguro (removendo sensibilidade).
- **catchAsync**: Wrapper utilitário para capturar exceções em controladores Express sem blocos try/catch.
- **AppError**: Classe de erro customizada para lançar exceções com status HTTP e mensagens amigáveis.
- **JWT (JSON Web Token)**: O token de autenticação que trafega nas requisições.
- **OTP (One-Time Password)**: O código numérico de 6 dígitos para recuperação de conta.
- **Debouncing**: Técnica de atrasar a execução de uma função (como busca) até que o usuário pare de digitar.
- **Skeleton**: Visual de carregamento neutro que ocupa o lugar do conteúdo antes dos dados chegarem.

## 3. Padrões de Nomenclatura
- **Controllers**: Sufixo `Controller` (Ex: `UserController.ts`).
- **Services**: Sufixo `Service` (Ex: `AuthService.ts`).
- **Routes**: Sufixo `routes` (Ex: `order.routes.ts`).
- **Schemas**: Sufixo `schema` (Ex: `product.schema.ts`).
