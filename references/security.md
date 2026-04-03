# Security — Agon Protection Strategy

A segurança no Agon é integrada em todas as camadas da aplicação, desde a entrada de dados no frontend até o processamento de pagamentos no backend.

## 1. Autenticação e Autorização

### JSON Web Tokens (JWT)
- O backend utiliza o padrão **JWT** para autenticação sem estado.
- O token é assinado no login/registro e enviado ao cliente.
- O cliente deve enviar o token no cabeçalho `Authorization: Bearer <token>` em todas as rotas protegidas.

### Role-Based Access Control (RBAC)
- O sistema distingue entre `USER` e `ADMIN`.
- O middleware `adminMiddleware` protege endpoints críticos (gestão de produtos, pedidos, usuários).

## 2. Proteção de Credenciais

### Hashing de Senhas
- Nenhuma senha é armazenada em texto claro. Utilize o **Bcrypt** com um fator de custo de `12`.
- O hashing ocorre no `AuthService` antes da persistência no banco.

## 3. Validação de Dados (Anti-Injection)

### Zod Validation
- Todo input via corpo da requisição (`JSON`), parâmetros de URL ou queries é validado pelo middleware `validate.middleware.ts`.
- Schemas rigorosos impedem que dados malformatados ou excessivos cheguem à camada de serviço.

## 4. Segurança na Integração com Webhooks

### Checkout Seguro
- O processamento de pagamentos do Abacate Pay é blindado por verificações de assinatura.
- Nunca confiar em informações de status vindas do frontend. A única fonte da verdade para o status é o Webhook validado pelo segredo `ABACATE_WEBHOOK_SECRET`.

## 5. Headers de Segurança e Infraestrutura

- **Helmet**: Adição automática de cabeçalhos HTTP que protegem contra ataques comuns (XSS, Clickjacking, Sniffing).
- **CORS**: Configuração restrita de origens permitidas (whitelist) baseada em variáveis de ambiente.
- **Rate Limit**: Proteção contra ataques de força bruta em endpoints de login e recuperação de senha.

## 6. Integridade do Banco de Dados
- Uso de **Environment Variables** herméticas para a `DATABASE_URL`.
- O Prisma ORM previne injeções SQL por padrão ao utilizar consultas parametrizadas.


## 7. 🔒 Governança de Segurança

### 🔒 Regras Obrigatórias
- **No plaintext**: Senhas devem ser hasheadas com Bcrypt (salt rounds: 12) antes de qualquer persistência.
- **Signed Webhooks**: O processamento de pagamentos **DEVE** validar a assinatura do Abacate Pay.
- **Admin Lock**: Rotas administrativas devem ser protegidas por `adminMiddleware` no Router.

### 🚫 Anti-padrões
- **Exposição de Credenciais**: Nunca comite arquivos `.env` ou chaves de API.
- **JWT no LocalStorage**: Armazene dados de perfil no contexto, mas gerencie sensibilidade com cuidado em Client Components.

### ✅ Boas Práticas
- **Rate Limit Everywhere**: Endpoints de escrita e login devem ter limites de requisição ativados.
- **Zod Sanitization**: Use schemas para limpar e formatar inputs antes de processá-los.

## 8. Automate Security Scanner (CI/CD)
O repositório opera em regime de **Zero Vulnerability Tolerance**. As seguintes Actions estão travando o código na Pipeline do Github antes do merge:
- `trufflesecurity/trufflehog`: Garante que nenhum token do abacate pay e AWS/Resend, por mínimo que seja, entre no repositório.
- `npm audit`: Interrompe a compilação por vulnerabilities Level=High ou superior nas dependências npm instaladas.
