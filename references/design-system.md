# Design System — Agon Visual Experience

O Agon é construído sobre uma identidade visual de impacto, inspirada no minimalismo premium da Nike e na energia vibrante da Seleção Brasileira.

## 1. Paleta de Cores (HSL)

Utilizamos o modelo HSL para maior controle sobre luminosidade e saturação nas variações de estado (hover, active).

### Cores Base
- **Background (Nike Dark)**: `hsl(220 80% 6%)` — Um azul profundo, quase preto, para máxima imersão.
- **Card/Surface**: `hsl(220 60% 8%)` — Camadas subjacentes para profundidade.

### Cores da Marca (Brasil Elite)
- **Primary (Brasil Green)**: `hsl(143 100% 31%)` — O verde oficial da vibração nacional.
- **Secondary (Brasil Yellow)**: `hsl(52 100% 50%)` — Amarelo canarinho para destaques de conversão.

## 2. Tipografia

A hierarquia tipográfica reforça a mensagem de autoridade e performance.

- **Headlines (Bebas Neue)**: Urbana, impactante e agressiva. Utilizada em `H1`, `H2` e slogans.
    - *Atributos*: Uppercase, Black, Tracking tighther (-0.05em).
- **Body & UI (Inter)**: Limpa, legível e técnica. Utilizada em textos, inputs e navegação.
    - *Atributos*: Peso normal (400) a negrito (700).

## 3. Atributos Visuais Premium

### Glassmorphism (Agon Glass)
Implementado via utilitário `.glass-nike`:
- `Background`: `bg-background/60`
- `Blur`: `backdrop-blur-xl`
- `Borda`: `border-border/50`

### Sombras e Profundidade (Nike Elevation)
- **.shadow-nike**: Sombra suave de elevação.
- **.shadow-huge**: Sombra profunda para buscas e overlays (`0 40px 100px -20px`).
- **.shadow-neon**: Brilho externo sutil para botões verdes de conversão.

## 4. Gradientes

- **Text Gradient Brasil**: `linear-gradient(135deg, Brasil Green, Brasil Yellow)`.
- **Nike Gradient Glow**: Orbes de fundo (`radial-gradient`) nas extremidades do layout para evitar o "preto chapado".

## 5. Sombras e Bordas
- `Radius`: `0.75rem` (12px) — Cantos suavemente arredondados, mas ainda modernos.
- `Border Color`: `hsl(220 40% 15%)` — Azul escuro sutil para delimitar seções sem contraste agressivo.

## 6. 🔒 Governança do Design System

### 🔒 Regras Obrigatórias
- **Token Consistency**: Use exclusivamente variáveis `var(--primary)`, `var(--secondary)`, etc. Cores hex/rgb soltas são proibidas.
- **Premium Glass**: Menus e modais devem usar obrigatoriamente a classe `.glass-nike`.
- **HD Assets**: Banners de heróis não podem ter resolução inferior a 1200px de largura.

### 🚫 Anti-padrões
- **Color Drift**: Criar novas cores que não estejam mapeadas no `globals.css` (.dark).
- **Abrupt Transitions**: Elementos que aparecem ou somem sem transição CSS ou `framer-motion`.

### ✅ Boas Práticas
- **State Feedback**: Todo componente interativo deve ter um estado de `:hover` e `:active` claramente definido.
- **Responsive-First**: Teste qualquer mudança visual em resoluções mobile (375px) e Ultra-wide (1920px).
