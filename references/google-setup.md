# Guia de Elite do Marketing (Google Analytics & Search Console)

Ter o domínio `agonimports.com` abre espaço oficial para o maior cérebro de métricas de tráfego do mundo: o Google. Agora que temos a certidão de nascimento da loja da Nike, você deve ligá-la às veias do Search Console (para aparecer organicamente no Google) e do Analytics (para vigiar quem entra na loja).

---

## 👁️ 1. Rastreamento (Google Analytics 4)

O site já tem um vigilante silencioso no código! Na pasta `apps/frontend/src/lib/analytics.ts`, o Agon já está estruturado para disparar mísseis pro Google assim que um usuário visita uma camisa, clica em "Adicionar" ou bota a mão no bolso pro "Checkout". Mas pra ele saber pra qual conta enviar os dados de conversão, você deve pegar a sua **Measurement ID**.

### Como Configurar:
1. Entre com seu Gmail no [Google Analytics](https://analytics.google.com/).
2. Clique em **Admin** (engrenagem no canto inferior esquerdo) > **Acessar Conta de Usuário > Criar Conta** (ou Propriedade).
3. Nomeie a propriedade de `Agon Imports Oficial`.
4. Em URL do Site/Fluxo de Dados: Coloque obrigatoriamente `https://agonimports.com`.
5. O Google vai te parabenizar e no fim vai piscar na tela a sua **Measurement ID** (ela começa com `G-` seguido por letras e números, exemplo `G-WX48YZ...`).
6. Volte à VPS e edite as variáveis secretas colando-a:
   ```env
   GOOGLE_ANALYTICS_ID=G-SuAChaVeAqui
   ```
Pronto, o script de captura global do projeto será ligado! O código irá mandar o número de usuários ativos pro seu app no celular!

---

## 🌐 2. Domínio e Ranqueamento SEO (Google Search Console)

O Search Console faz a plataforma indexar `agonimports` direto no buscador e ajuda no tráfego sem pagar anúncio. O Google exige que você **prove** que é o dono desse Domínio indo lá no hospedeiro dele (A Hostinger!).

### Como Configurar:
1. Logue com o mesmo e-mail no [Google Search Console](https://search.google.com/search-console).
2. Clique em **Adicionar Propriedade** no canto superior esquerdo.
3. Escolha o quadrado da esquerda **Domínio**.
4. Digite: `agonimports.com`.
5. O Google vai abrir um aviso chato de verificação vermelha dizendo: "Copie esse **Registro TXT** e cole no seu provedor de DNS".
6. Copie a linha TXT longa que ele forneceu (`google-site-verification=...`).
7. **Abra a Hostinger** (Editor de Zona DNS de novo, igual fizemos pro e-mail).
   - **Adicionar Novo Registro**:
   - Tipo: `TXT`
   - Nome: `@`
   - Valor: (Cole aquela chave do Google inteira).
8. Clique em **Salvar**, volte pro Google Search Console e clique na tarja verde em **Verificar**. 
   *(Se disser Verificação Falhou, espere mais 30 min e aperte Verificar de novo. Caches de DNS demoram e logo as aranhas do Google farão o crawling inicial da Agon!)*
