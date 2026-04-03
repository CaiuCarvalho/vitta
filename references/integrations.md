# System Integrations — Agon Experience

Este documento consolida TODAS as dependências externas que a arquitetura monorepo engaja, focando totalmente em como estas integrações precisam se comportar em **Produção** (na Hostinger sob o domínio `agonimports.com`). Nenhuma credencial de homologação "Sandbox" deve vazar para a nuvem definitiva.

## 1. Pagamentos e Checkouts (Abacate Pay)

O Agon usa Abacate Pay como seu "Pixel-perfect Gateway". Todos os pagamentos gerenciais e retornos (PIX Status e CC) dependem dele.
- **Produção vs Local**: O AbacatePay fornece duas chaves na sua dashboard. Em `localhost` usamos os tokens `abc_dev_`. Na nuvem Hostinger, você **deve** usar as chaves que começam com `abc_live_`.
- **Configurações Faltantes na Produção**:
  - `ABACATE_PAY_API_KEY`: Token Bearer Live.
  - `ABACATE_WEBHOOK_SECRET`: A string HMAC gerada para assinar requisições POST.
- **Action de Webhook Pós-Deploy**: Ao logar na Dashboard do Abacate, você precisará informar lá dentro a URL oficial para onde eles avisarão a API do Agon que a grana caiu. 
  - 🔗 **Endpoint de Cast**: `https://agonimports.com/api/webhooks/abacatepay`

## 2. E-mails Transacionais (Resend)

Todas as comunicações (Boas Vindas, Tracking e OTP de Reset de Senha) são renderizadas no backend via React.email e disparadas via SDK do Resend.
- **Configuração Faltante (Hostinger Domain)**: Atualmente, os e-mails caíam do falso `onboarding@resend.dev`. Em produção a flag `EMAIL_FROM` acusa `contato@agonimports.com` como primária. 
- 🔒 **Ação Crítica de Segurança de DNS**: O serviço do Resend irá **bloquear o envio** com nosso remetente real nas primeiras tentativas a não ser que você vá na Hostinger de Domínio e integre no DNS os "TXT Records" e o "DKIM" que a plataforma Resend exige na hora que você cadastra seu domínio lá.
- **Failover Logic**: Mantemos "Graceful Degradation". Se o envio do e-mail de Boas vindas falhar porque o Resend estourou API limits, o usuário ainda conseguirá criar a conta normalmente (apenas o node emitirá `console.warn` invisível pro cliente).

## 3. Imagens de Produtos e Perfil (Cloudinary)

Imagens de produtos no app Next.js apontam dinamicamente para uploads da Cloudinary.
- Nenhuma URL hardcoded para modificar. A variável `CLOUDINARY_URL` alimenta toda a UI caso existam uploaders em Next. 

## 4. Google Analytics / Hotjar (Tráfego)

Para metrificação do e-commerce (Conversões e Abandono de Carrinho).
- Na variável `GOOGLE_ANALYTICS_ID`, alimente o código gerado começando com `G-XXXX`. O script já vigia o `layout.tsx` oficial para varrer clicks no botões Elite de produtos e rotas de Checkout.

## 5. Autenticação (JWT)

A autenticação é puramente Nativa e **Extremamente Segura**, mantida internamente pelo nosso próprio ORM para evitar vendor-lock (como Clerk que eleva precos).
- **Security Posture**: Usamos Bcrypt. O Salt é de custo alto (`12`). Isso garante que os hashes no banco estejam invioláveis a quebra simples. O Token (`vitta_token`) gerado via `JWT_SECRET` é encriptado robustamente contendo os cargos (`USER` vs `ADMIN`). 
- **Verificação em Duas Fases (OTP)**: O time escolheu códigos digitados de 6-dígitos para recuperação ao invés de Magics Links no Email. Isso elimina fraudes de Proxy Email Clicks que explodem em infraestruturas baratas.

## ⚙️ Checklist Fina de Deploy 

Antes de abrir pro público final certifique-se no arquivo `.env` do seu `/backend/`:
- [ ] Chaves de DB apontam pra PostgreSQL remoto persistente, não o temporário do Docker Dev.
- [ ] `ABACATE_PAY_API_KEY` começa com `abc_live_`
- [ ] DNS do domínio no Hostinger possui o TXT apontando pro servidor de chaves do Resend.
