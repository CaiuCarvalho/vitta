# Decision Framework — Agon Engineering Choices

Este documento define a lógica de tomada de decisão para o desenvolvimento do Agon. O objetivo é garantir consistência, mesmo quando houver múltiplas formas de resolver um problema.

## 1. Performance vs Legibilidade (Trade-offs)

### Priorize a Performance quando:
- A operação ocorre em uma rota crítica de checkout ou faturamento.
- O componente é renderizado em listas longas (ex: Arsenal).
- O impacto no Core Web Vitals (LCP, TBT) for mensurável.

### Priorize a Legibilidade quando:
- A lógica de negócio é complexa e precisa de manutenção frequente.
- O código será compartilhado entre múltiplos desenvolvedores.
- A otimização de performance trouxer ganhos marginais (< 10ms) às custas de um código "obscuro".

## 2. Reuso vs Criação de Componentes

### Reutilize quando:
- O comportamento visual e funcional for idêntico a um componente existente.
- A mudança necessária puder ser resolvida com uma nova `prop` opcional e simples.

### Crie um novo quando:
- O componente existente exigir lógica condicional excessiva (> 3 `if/else` complexos) para se adaptar.
- Os domínios de negócio forem distintos (Ex: Um botão de "Comprar" tem comportamentos de rastreio diferentes de um botão de "Login").
- O custo de abstração for maior que o custo de duplicação controlada.

## 3. Quando Refatorar vs Manter

### Refatore quando:
- Encontrar lógica duplicada em mais de 3 arquivos (`Rule of Three`).
- O arquivo atual dificultar a implementação de uma nova regra de segurança obrigatória.
- Houver um anti-padrão documentado em `/references` que esteja bloqueando a evolução.

### Mantenha quando:
- O código atual for estável, testado e a refatoração for puramente estética.
- O risco de introduzir bugs em fluxos de pagamento (Abacate Pay) for alto sem uma suíte de testes E2E completa para validar.

## 4. Regras de Fallback (Incerteza)

Quando uma definição não estiver clara nos guias:
1. **Segurança Primeiro**: Escolha o caminho que exponha menos dados e exija mais validação.
2. **Padrão de Mercado**: Siga as convenções oficiais do Next.js (Frontend) e Express (Backend).
3. **Mínima Surpresa**: Escreva o código da forma que um desenvolvedor sênior esperaria encontrar ao abrir o arquivo.

## 5. Justificativa de Decisão (Agent Mode)
Ao tomar uma decisão complexa, o agente deve citar:
> "Decidi [Ação] baseando-me no critério [Critério] do `decision-framework.md` para garantir [Resultado]."
