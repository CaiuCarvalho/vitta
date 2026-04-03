# Frontend — Next.js Agon Client

O Agon é uma aplicação de página única moderna e de alta performance baseada em **Next.js (App Router)** e **React**.

## 1. Stack Tecnológica

- **Next.js 14+**: Renderização rápida, SEO otimizado.
- **Tailwind CSS**: Estilização baseada em utilitários corporativos.
- **Framer Motion**: Orquestra animações de interface fluida.
- **Lucide React**: Ícones minimalistas.
- **Zod + React Hook Form**: Validação rigorosa de formulários.

## 2. Padrões de Organização

As pastas dentro de `apps/frontend/src` seguem:

- **app/**: Rotas e layouts.
- **components/**: Componentes de UI e seções de página.
- **hooks/**: Lógica de estado encapsulada.
- **context/**: Provedores de estado global.
- **lib/**: Funções utilitárias.

## 3. Gerenciamento de Estado

### Auth Context (`useAuth`)
Controla o login, logout e informações do usuário autenticado. 
- Armazena o `JWT` e dados básicos do perfil.
- Sincroniza o estado entre a Navbar e demais telas.

### Cart Context (`useCart`)
Gerencia os itens no carrinho, cálculo de totais e persistência local (`LocalStorage`).
- O cálculo final sempre é validado pelo Backend no checkout.

### Wishlist Context (`useWishlist`)
Gerencia os favoritos do usuário (limite de 20 itens).

## 4. Animações e Micro-interações

- **Logo Flight**: O componente `Logo` utiliza `layoutId` para transição entre a Navbar e a Sidebar/Login.
- **QuickSearch**: Feedback imediato via overlays de sugestão (typeahead).
- **Hover States**: Todos os botões e links possuem transições de escala (`scale-105`) e brilho.

## 5. Práticas de SEO e Performance

- **Skeleton Loaders**: Exibidos em vitrines e buscas durante o carregamento de dados.
- **Google Analytics 4**: Eventos automáticos de e-commerce (`view_item`, `add_to_cart`, `purchase`).
- **Imagens**: Uso de `next/image` para compressão e lazy loading.
- **Debounced Search**: Atraso de 300ms em inputs de busca para reduzir carga na API.

## 6. Padronização de Componentes UI

## 7. 🔒 Governança do Frontend

### 🔒 Regras Obrigatórias
- **App Router First**: Novas rotas devem seguir o padrão `app/` do Next.js.
- **Server/Client Boundary**: Mantenha lógica de fetch em `Server Components` e interatividade em `Client Components`.
- **Theme Integrity**: Use exclusivamente os tokens HSL do `globals.css`. Cores hardcoded são proibidas.
- **Context-driven State**: Use os contextos globais (`Auth`, `Cart`) para dados cruzados entre componentes.

### 🚫 Anti-padrões
- **Inline Styling**: Evite o atributo `style`. Use Tailwind CSS.
- **Prop Drilling**: Não passe dados por mais de 3 níveis. Use `Context` ou `State Management`.
- **Heavy Client Logic**: Evite processamentos pesados no navegador que possam ser feitos no backend.

### ✅ Boas Práticas
- **Premium UI**: Todo elemento interativo deve ter feedback de hover e animações `framer-motion` sutis.
- **SEO Ready**: Adicione metadados em todos os `layout.tsx` ou `page.tsx` principais.
- **Skeleton Experience**: Use loaders neutros durante transições de carregamento.
