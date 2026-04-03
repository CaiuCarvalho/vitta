# Continuous Integration / Continuous Deployment (CI/CD) — Agon Experience

Este documento consolida como a esteira de verificação do código do Agon funciona para manter o selo de qualidade listado em `claude.md`. Todo PR está refém deste sistema atuarial.

## 1. Visão Geral (Pipeline)

Utilizamos o **Github Actions** com regras atômicas englobadas no arquivo `.github/workflows/ci.yml`.  
O pipeline divide-se em 4 eixos principais (Jobs) que correm em ambientes virtuais independentes:

- **Quality**: Executa varredura com Lint + Typescript checking usando `turbo run lint`.
- **Security Check**: Aplica `TruffleHog` Action à procura de `SECRETS` indesejadamente embutidos no log de commits além de vulnerabilidades NPM.
- **Unit & Integração**: Roda suites leves em Vite (`npm run test`).
- **End-to-End (E2E)**: Roda uma checagem intensa montando o painel em emuladores no Playwright.
- **Build Core**: Força a compilação cruzada do Monorepo testando acoplamento de rotas e Mappers de pacote puro (`@vitta/database`).

---

## 2. Padrões de Bloqueio & Regras Ativas

### Review Bot
A automatização dispõe agora do Job `pr-reviewer.yml`. Este robo comenta sistematicamente a matriz de arquitetura e padrões (hsl tokens) para o autor testá-los mentalmente antes de aprovar.

### Github Flow 
O repositório está sujeito às Seguranças do GitHub:
- **Require Status Check to Pass**: Esta é uma opção obrigatória em "Settings -> Branches -> Add rules". Você **DEVE** marcar todos os jobs de status do Github actions descritos em "Require branches to be up to date before merging". 

### Falhas comuns e como Debugar:

1. **Linting Failure:**
   - Erro: `Parsing error: Unexpected keyword`.
   - Solução: Execute `npm run lint -- --fix` localmente antes de um novo Push.
2. **"Process Exited with Code 1" (Trufflehog Secret Found)**
   - Risco: Você mandou pra cima as chaves de Email ou API!
   - Solução: Faça o squash e rescreva o histórico dos commits `git reset HEAD~1` substituindo a chave vazada, modifique `env.example` e avise imediatamente no chat.
3. **Playwright Timeout**:
   - Um botão de "Adicionar" do Design System perdeu o `testid`. Atualize o UI Package ou teste no `npx playwright show-trace`.

---

## 3. Melhorias Futuras (Next Steps 🚀)

Para elevarmos o pipeline de apenas CI para CD (Deployment Contínuo):
- **Ambientes Efêmeros (Preview via Vercel)**: Integrar bot de CI do Vercel e garantir links dinâmicos de PR para aprovação visual além da de código.
- **Monitoramento e Alertas Pós-Deploy**: Plugar `Sentry` com webhook disparando Slack Alert quando os logs do `app.ts` e de checkout derem Crash 500 em produção.
