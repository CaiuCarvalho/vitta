# Configuração do Resend + Hostinger (agonimports.com)

Para que o e-mail oficial **contato@agonimports.com** funcione sem cair em caixas de spam e seja autorizado pelo Resend, é preciso "provar" pra eles que você é dono do domínio `agonimports.com`. Faremos isso vinculando registros de DNS no painel da Hostinger.

---

## 🚀 Passo 1: Adicionar o Domínio no Resend

1. Acesse o painel do [Resend (resend.com)](https://resend.com/) e faça login.
2. No menu lateral esquerdo, clique em **"Domains"** e depois no botão **"Add Domain"**.
3. Na janela que abrir:
   - **Domain**: Digite `agonimports.com`
   - **Region**: Pode deixar em "US East (N. Virginia)" (Padrão e mais rápido na maioria dos casos).
4. Clique em **"Add"**. O Resend irá gerar uma lista de **Registros DNS (DNS Records)** para você. Mantenha essa tela aberta!

---

## ⚙️ Passo 2: Configurar o DNS na Hostinger

Agora vamos colar aqueles registros (que normalmente são 1 registro MX e 2 ou 3 registros TXT para DKIM/SPF) no seu servidor de domínio.

1. Em outra aba, faça login na sua conta da **Hostinger**.
2. Vá no painel do seu domínio **agonimports.com** e escolha a opção **"Editor de Zona DNS"** (ou "DNS Zone Editor").
3. Você precisará **adicionar novos registros** copiando exatamente o que o Resend mostrou. Para cada item da tela do Resend, faça o seguinte na Hostinger:

### Exemplo de Preenchimento na Hostinger:

**📍 Adicionando o Registro MX:**
- **Tipo**: `MX`
- **Nome (Host)**: `bounces`
- **Aponta Para (Destino/Valor)**: `feedback-smtp.us-east-1.amazonses.com` (Copie o exato do painel deles)
- **Prioridade**: `10`

**📍 Adicionando o Registro TXT (SPF):**
- **Tipo**: `TXT`
- **Nome (Host)**: `bounces`
- **Valor**: `v=spf1 include:amazonses.com ~all`

**📍 Adicionando os Registros TXT (DKIM):**
*(Você terá um registro de texto longo parecido com este)*
- **Tipo**: `TXT`
- **Nome (Host)**: `resend._domainkey`
- **Valor**: `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQD...` (Copie a chave inteira)

*(Nota: Alguns registros TXT gerados podem pedir apenas `_dmarc`. Só siga a tabela do painel do Resend copindo e colando).*

---

## ⏳ Passo 3: Verificação e Emissão da API Key

1. Volte na tela do Resend e clique no botão **"Verify DNS Records"**.
2. **Importante**: O DNS pode levar de 5 minutos a 24 horas para propagar (geralmente na Hostinger leva uns 10 minutos). Se o Resend der status "Pending", aguarde um café e clique em verificar de novo.
3. Assim que ficar verdinho (**Verified**), clique em **"API Keys"** no menu do Resend.
4. Crie uma nova chave API clicando em **"Create API Key"**. 
   - Dê o nome de `Agon Imports Produção`.
   - Escolha permissões (Full Access) e selecione o seu domínio autenticado `agonimports.com`.
5. **Copie a chave gerada** (ela começa com `re_...`).

---

## 🔌 Passo 4: Conectar ao seu Código

1. Lá no arquivo `.env` definitivo que for pro ar na VPS (e se quiser testar no `.env.local` na sua máquina agora), altere as variáveis:

```env
# A chave que você acabou de copiar:
RESEND_API_KEY=re_SuaChaveSecretaAquiDaProducao

# O remetente exato que você quer que apareça pro cliente:
EMAIL_FROM=contato@agonimports.com
```

**Pronto!** Teste criar uma conta ou resetar a senha no Frontend. O Resend disparará mensagens em nome do `contato@agonimports.com` de maneira limpa, profisional e caindo na caixa de entrada VIP.
