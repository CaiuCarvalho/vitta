# Performance — Agon Optimized Speed

A performance no Agon é um pilar da experiência "Elite", garantindo que o tempo de carregamento e a interatividade nunca frustrem o usuário.

## 1. Otimização do Frontend (Next.js)

### Skeleton Loaders
- Empregados em todas as vitrines (`ProductList`) e na busca rápida (`QuickSearch`).
- Evitam o CLS (Cumulative Layout Shift) e reduzem a percepção de espera.

### Next/Image
- Todas as imagens de produtos e banners utilizam o componente `Image` do Next.js para:
    - Redimensionamento automático via CDN Cloudinary.
    - Lazy loading nativo.
    - Conversão para WebP/Avif.

### Bundle Size & Code Splitting
- O uso de `Client Components` é limitado apenas a elementos interativos (Ex: `Navbar`, `AddToCart`).
- A lógica pesada de renderização da Home e Arsenal reside em `Server Components`.

## 2. Otimização da API (Backend)

### Debounced Search
- O input de busca na Navbar possui um **debounce de 300ms**, reduzindo o número de requisições desnecessárias à API durante a digitação.

### DB Query Optimization (Prisma)
- Uso de `skip` e `take` para paginação real no banco, evitando o carregamento de milhares de produtos na memória.
- Índices de banco de dados (`@@index`) em campos de busca frequente como `userId` em `Orders`.

## 3. Estratégias de Cache

- **Next.js Cache**: Uso de `revalidate` em rotas de produtos para servir versões estáticas rápidas que se atualizam em segundo plano.
- **LocalStorage**: Carrinho e Wishlist de visitantes são persistidos localmente para acesso instantâneo sem rede.

## 4. Identificação de Gargalos

- **Cold Starts**: Em ambientes Serverless, as primeiras requisições podem demorar. O uso de `Prisma Edge` ou pooling de conexões ajuda a mitigar.
- **Imagens Não Otimizadas**: Banners heros sem compressão (>2MB) são monitorados via Lighthouse.

---

### Dashboard de Performance Checklist
- [ ] LCP < 2.5s nas páginas principais.
- [ ] TBT < 300ms para inputs interativos.
- [ ] Imagens servidas em Next-gen formats via Cloudinary.

## 5. 🔒 Governança de Performance

### 🔒 Regras Obrigatórias
- **Debounced Inputs**: Todo campo de busca ou filtro que acione a API deve ter debounce (mínimo 300ms).
- **Skeleton First**: Nenhuma vitrine deve ser exibida vazia enquanto os dados carregam; use Skeletons.
- **Image Caps**: Nenhuma imagem de produto deve exceder 1MB após compressão.

### 🚫 Anti-padrões
- **Client-Side Heavy**: Processar filtros complexos ou ordenações de grandes listas no cliente.
- **Unoptimized Assets**: Usar imagens PNG/JPG brutas sem passar por `next/image` ou Cloudinary.

### ✅ Boas Práticas
- **Prefetching**: Utilize as capacidades do Next.js `Link` para prefetch de rotas críticas.
- **Memoization**: Use `useMemo` e `useCallback` com cautela em componentes de lista de alta frequência.
