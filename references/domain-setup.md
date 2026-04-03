# Domain Setup — Agon Imports

A arquitetura do Agon utiliza um setup avançado de Single Domain (`agonimports.com`). Essa configuração fortalece o SEO e simplifica a troca de cookies sensíveis reduzindo fricções de CORS cross-domain.

## 1. Topologia de Rotas

O Front-end e o Back-end compartilham o mesmo domínio nativo em produção. A separação é feita via Proxy (Nginx, Vercel ou Cloudflare):

- **Rotas de Interface (Next.js)**: `https://agonimports.com/*`
- **Rotas API (Express)**: `https://agonimports.com/api/*`

> [!TIP]
> Em produção, NUNCA utilize fallbacks para `http://localhost`. Todas as configurações usam a variável nativa, mas atrelam `agonimports` como fallback robusto.

## 2. Redirecionamento de SEO (www vs non-www)
A estratégia Canonical do Agon exige que todo tráfego via `www` seja jogado para a base nativa (root).
Para garantir isso na raiz da aplicação, o arquivo de `middleware.ts` do frontend (Next.js) já opera capturando o Header `host` e redicionando requests de `www.agonimports.com` para `agonimports.com` com Status Code `301` (Permanent Redirect).

## 3. Ambientes (Variáveis)

| Variável | Staging (Local) | Produção (VPS) |
| :--- | :--- | :--- |
| `FRONTEND_URL` | `http://localhost:3000` | `https://agonimports.com` |
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001` | `https://agonimports.com/api` |
| `NEXTAUTH_URL` | `http://localhost:3000` | `https://agonimports.com` |

## 4. Próxima Etapa: Infraestrutura (VPS)
A configuração e compra da VPS Hostinger ditará a estabilidade destas URLs. Ao inicializar o Ubuntu, será essencial instalar o `Nginx` e criar os blocos `location /` apontando para a porta do Next.js e o `location /api/` apontando para o Express via proxy pass, e emitir os certificados SSL via Let's Encrypt (Certbot).
