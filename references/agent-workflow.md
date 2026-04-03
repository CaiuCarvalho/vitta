# Agent Workflow — Agon Step-by-Step Execution

Este documento define o processo operacional padrão (SOP) que o agente de IA deve seguir ao receber qualquer solicitação de desenvolvimento no projeto Agon.

## 1. Passo a Passo Obrigatório (O Ciclo de Elite)

### Fase 1: Audiência e Alinhamento
- Leia o `claude.md` para entender a visão do produto.
- Liste as solicitações do usuário e identifique mudanças latentes (ex: uma mudança de fonte afeta todo o design system).

### Fase 2: Consulta às Referências
- **Obrigatoriedade**: Antes de qualquer linha de código, o agente deve consultar a pasta `/references`.
- Identifique os arquivos pertinentes (Ex: `backend.md` se for um novo controller).
- Verifique a seção **🔒 Regras Obrigatórias** e **🚫 Anti-padrões** do componente em questão.

### Fase 3: Validação de Consistência
- Compare o código atual do repositório com as diretrizes das referências.
- Se houver divergência (ex: falta de `catchAsync` em um controller legado), a nova implementação deve corrigir o padrão ou justificar o uso do framework de decisão.

### Fase 4: Implementação Justificada
- Realize as alterações.
- Todo commit ou relatório deve citar quais referências serviram de base.

## 2. Sistema de Aprendizado Contínuo (Learning System)

Sempre que uma nova feature for implementada ou um bug for corrigido:

1. **Documente**: Se um novo padrão de componente emergiu (ex: um novo tipo de banner), adicione-o ao `design-system.md` ou `ux-guidelines.md`.
2. **Lições Aprendidas**: Se houver um erro de implementação recorrente, mova-o para a seção **🚫 Anti-padrões** do guia relevante.
3. **Glossário**: Se um novo termo de negócio foi discutido, atualize o `glossary.md`.

## 3. Comportamento Esperado do Agente

Antes de executar, o agente deve responder internamente (ou em seu plano):
- "Quais referências estou usando?"
- "Quais regras estou seguindo?"
- "Essa decisão está alinhada com o `decision-framework.md`?"

## 4. Auditoria de Saída
O agente deve rodar o checklist de `validation-rules.md` antes de dar a tarefa por concluída.
