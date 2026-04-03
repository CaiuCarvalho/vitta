# UX Guidelines — Agon Elite Experience

No Agon, a experiência do usuário (UX) é tratada como um serviço de hospitalidade digital premium, onde a fluidez e o impacto visual são fundamentais.

## 1. Princípios da Marca Agon

### Elite Performance
- Menos é Mais: Interfaces minimalistas que dão destaque aos produtos e à história da Seleção Brasileira.
- Imersão: Uso de **Dark Mode** profundo (`Nike Dark`) para criar um ambiente de exclusividade.

### Impacto Visual (Agon Wow)
- Heros Ultra HD: Banners iniciais devem usar imagens imersivas de alta resolução (>1200px) sem bordas.
- Logo Flight: Transições de logo consistentes para orientar o olhar do usuário.

## 2. Smart Checkout Strategy

O processo de finalização de compra foi desenhado para reduzir o atrito ("Zero Friction"):

- **Identificação Progressiva**: O sistema detecta o que falta (CPF, Telefone ou Endereço) e solicita apenas esses campos de forma inteligente.
- **Persistent Data**: As informações fornecidas são salvas automaticamente no perfil para o próximo checkout em um clique.
- **Transparência de Frete**: O cálculo é realizado no backend e exibido com clareza antes do pagamento.

## 3. Feedback Visual e Micro-animações

- **Skeleton Loaders**: Indispensáveis em qualquer carregamento assíncrono para manter a percepção de performance.
- **Haptic-inspired Hover**: Escalonamento sutil (`1.05x`) e brilhos neon ao passar o mouse por elementos interativos.
- **Immediate Response**: Feedback instantâneo ao adicionar itens no carrinho ou alternar campos de busca.

## 4. Agon Discovery (Navegação)

- **Instant Search**: Sugestões automáticas (`typeahead`) na Navbar conforme a digitação.
- **Breadcrumbs Estilizados**: Caminhos de navegação que ajudam a situar o usuário sem poluir a interface.
- **Filtros Ágeis**: Sidebar Drawer com filtros de fácil acesso no mobile e desktop.

## 5. Mobile-First Approach

Toda a interface deve ser funcional e esteticamente agradável no celular:
- Botões de toque com tamanho mínimo de `44x44px`.
- Navegação via Drawer (Menu Lateral) acessível com o polegar.
- Checkout otimizado para preenchimento rápido em telas pequenas.

## 6. 🔒 Governança de UX

### 🔒 Regras Obrigatórias
- **Smart Fields Only**: Não peça dados que não são estritamente necessários para a etapa atual do funil.
- **Immediate Feedback**: Toda ação de sucesso (Ex: Adicionar ao Carrinho) deve gerar um Toast ou feedback visual instantâneo.
- **Error Graciousness**: Erros de formulário devem ser exibidos de forma clara e próxima ao campo, nunca apenas em alertas globais genéricos.

### 🚫 Anti-padrões
- **Dead Ends**: Deixar o usuário em uma tela sem opção de retorno ou "Home".
- **Visual Clutter**: Excesso de banners que competem pela atenção do usuário (Foco no Produto).

### ✅ Boas Práticas
- **Elite Copy**: Utilize micro-copy que reforce a marca (Ex: "Finalizar Minha História" em vez de "Confirmar Compra").
- **Accessibility**: Garanta contraste de cores acessível, especialmente nos textos sobre gradientes.
