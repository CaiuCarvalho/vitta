# 🔍 Auditoria de Codebase — Agon Imports

Esta auditoria mapeia a estrutura atual do projeto e identifica pontos de melhoria para a refatoração.

## 📁 Estrutura de Pastas

| Pasta | Função Atual | Status |
| :--- | :--- | :--- |
| `apps/frontend` | Aplicação Next.js (Storefront) | ✅ Padrão |
| `apps/backend` | API Express / Node.js | ✅ Padrão |
| `packages/database` | Prisma Schema e Cliente Compartilhado | ✅ Padrão |
| `packages/ui` | Componentes Design System (Shadcn) | ✅ Padrão |
| `packages/utils` | Funções utilitárias e DTOs | ✅ Padrão |
| `services/` (Raiz) | Workspaces de serviços (vazios/redundantes) | ⚠️ Fora de Padrão |
| `models/` (Raiz) | Workspaces de modelos (vazios/redundantes) | ⚠️ Fora de Padrão |
| `jobs/` (Raiz) | Workspaces de jobs (vazios) | ⚠️ Fora de Padrão |
| `docs/` | Contém `claude.md` e `references/` | ⚠️ Deslocado |

## 🚩 Arquivos Suspeitos ou Fora de Padrão

### Arquivos na Raiz (Root Junk)
- `tmp_upload3.js`, `tmp_upload4.js`, `tmp_upload_blob.js`, `tmp_upload_files.js`: Scripts temporários de teste que devem ser removidos.
- `img1.jpg`, `pele1.jpg`, `pele2.jpg`: Assets de imagem jogados na raiz em vez de estarem no `public/` do frontend.

### Inconsistências de Arquitetura
1. **Duplicação de Serviços**: O `backend` possui sua própria pasta `src/services`, enquanto existem pastas de `services/` na raiz do monorepo que estão praticamente vazias.
2. **Localização de Referências**: O `claude.md` e a pasta `references/` estão dentro de `docs/`, mas são referenciados em toda a documentação como se estivessem na raiz.

## 🚀 Proposta de Organização Ideal

```text
.
├── apps/
│   ├── frontend/        # Next.js
│   └── backend/         # Express + Business Logic
├── packages/
│   ├── database/        # Prisma
│   ├── ui/              # Design System
│   ├── utils/           # Shared Logic (Mappers, DTOs)
│   └── config/          # Shared Eslint/TS configs
├── references/          # Mover de docs/ para a raiz
├── scripts/             # Automações de dev/deploy
├── claude.md            # Mover de docs/ para a raiz
└── package.json
```

## 🔐 Observações de Segurança
- Identificadas variáveis sensíveis no `.env` (JWT_SECRET, etc).
- Necessário validar se há chaves de API expostas em logs ou arquivos de exemplo.
