## O que foi feito nesse Pull Request?
*(Descreva de maneira sucinta a finalidade exata deste pull request)*

## Revisão de Componentes & Arquitetura (Agon SOC)
Marque as conformidades técnicas aplicadas:

- [ ] Os Controladores (`Controllers`) delegam estritamente tudo ao `Services`?
- [ ] Inputs sofreram escaneamento em massa garantindo saneamento via esquemas fortes de restrição local Zod (`schema`)?
- [ ] Os Mappers filtraram exposição externa de referências do ORM e Hashes/Senhas e Tokens do banco (`password_hash`, `_count`)?

## Verificações de Estabilidade (CI & Local)
- [ ] Ambiente de Desenvolvimento compila sem gargalos nativos NextJS.
- [ ] Playwright (`test:e2e`) rodou integralmente nos fluxos mutados em ambiente isolado.
- [ ] Limpeza do esqueleto concluída (nenhum bypass `any` nas tipagens de objetos soltos ou scripts vazios de testes log/temp).

## Reference Guides Tracker
*(Este PR necessitava de uma alteração transversal nas /references de infraestrutura? Se sim, a wiki no markdown em referências foi atualizada refletindo o design de software adotado?)*
