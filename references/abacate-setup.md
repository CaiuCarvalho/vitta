# Abacate Pay — Configuração sem CNPJ (Pessoa Física)

**Boas notícias:** O Abacate Pay, assim como o Mercado Pago e o Stripe, **permite que você crie uma conta usando apenas o seu CPF!**

Eles são extremamente focados em infoprodutores e e-commerces que estão nascendo. Há algumas restrições de limite de saque mensal (geralmente mais baixo para pessoas físicas contra jurídicas), mas para validar o Agon Imports e rodar o fluxo de PIX inicial, o **CPF é 100% suportado e super tranquilo.**

---

## 🥝 Passo 1: Conta e Chaves de API

1. Acesse [Abacate Pay](https://abacatepay.com/pt) e clique em **"Criar Conta"**.
2. Escolha o cadastro e verificação de conta como **Pessoa Física**.
3. Siga com o envio da documentação básica (uma foto sua e do documento atrelado ao seu CPF).
4. Assim que for validado (o que é bem rápido), logue na plataforma e acesse **Configurações > API / Desenvolvedores**.

Lá você vai ver os dois universos:
- as chaves que iniciam com `abc_dev_` (para você brincar de fazer compras falsas enquanto desenvolvemos).
- as chaves que iniciam com `abc_live_` (para onde a grana cai de verdade rodando o Pix na sua VPS amanhã).

## 📡 Passo 2: O Webhook (Crucial)

O Webhook é o "carteiro" do Abacate Pay. É a configuração lá no painel deles de como eles avisarão a nossa API na VPS que um PIX ou Cartão foi efetivamente pago com sucesso! Sem o webhook, o carrinho do comprador na Agon vai ficar travado em `PENDING`.

1. No painel de Desenvolvedor do Abacate Pay, você achará a seção de **"Webhooks"**. Encontre o botão "Adicionar Webhook".
2. Eles pedirão qual é a **URL de Destino**. Digite (usando o domínio da aula anterior):

   >`https://agonimports.com/api/webhooks/abacatepay`

3. Marque para eles enviarem eventos quando uma `Billing` (Fatura) for criada, alterada, e principalmente **"billing.paid"** (Paga).
4. Ao salvar, eles te gerarão um **"Webhook Secret"** e vai aparecer ali para copiar.

---

## 🔌 Passo 3: Colocando no Agon

Copie a Chave API e a Chave de Webhook gerados pelo painel e jogue no nosso `.env` ou diretamento na aba "Environment Variables" da sua Hostinger de VPS quando for fazer o Deploy amanhã:

```env
# Seu cofre do Servidor / VPS da Hostinger
ABACATE_PAY_API_KEY=abc_live_sUaChAvELiVeAkI
ABACATE_WEBHOOK_SECRET=aSuaChAvEdEwEbHoOkAquiBEMGrAndE
```

> [!IMPORTANT]
> A nossa API já valida automaticamente assinaturas anti-fraude originadas deles (HMAC) e troca o status no PostgreSQL para `PAID` abaixando o número do seu estoque real! Você só precisará popular as chaves acima.
