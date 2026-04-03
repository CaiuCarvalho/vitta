# Validation Rules — Agon Quality Gate

Este documento serve como o checklist final de aceitação (**Definition of Done**) para qualquer tarefa executada no projeto Agon. Nada deve ser considerado "Pronto" sem passar por este selo de qualidade.

## 1. Integridade de Arquitetura (SOC)
- [ ] O componente reside na pasta correta seguindo a convenção `apps/` vs `packages/`?
- [ ] Houve bypass de lógica? (Ex: Banco sendo chamado diretamente pelo frontend)
- [ ] Os Mappers foram usados para filtrar dados sensíveis?

## 2. Consistência de Design System
- [ ] Estão sendo usados tokens HSL do `globals.css`?
- [ ] Banners e heróis estão em Ultra HD (> 1200px)?
- [ ] Feedbacks de hover e animações `framer-motion` foram aplicados?

## 3. Tipagem e Segurança
- [ ] O código está livre de `any`?
- [ ] Inputs externos passaram por validação Zod?
- [ ] Webhooks possuem validação de assinatura?

## 4. Performance e UX
- [ ] Skeleton loaders foram aplicados em carregamentos assíncronos?
- [ ] Há debouncing em campos de busca (> 300ms)?
- [ ] Imagens foram passadas por `next/image` ou otimização Cloudinary?

## 5. Qualidade e Testes
- [ ] Novos `Services` possuem cobertura mínima de 70%?
- [ ] O build passa via Turbo (`npm run build` na raiz)?
- [ ] Testes E2E (Playwright) validam o fluxo de faturamento se este foi alterado?

## 6. Governança e Aprendizado
- [ ] Os arquivos em `/references` foram atualizados se um novo padrão emergiu?
- [ ] A decisão técnica está justificada com base no `decision-framework.md`?
- [ ] Lições aprendidas de erros durante a implementação foram adicionadas à seção de **🚫 Anti-padrões** do guia relevante?

---
### Selo de Qualidade Agon
> "Sempre entregue mais do que o esperado visualmente, e exatamente o que é esperado tecnicamente."
