const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'apps/frontend/src/lib/api.ts',
  'apps/frontend/src/lib/api/orders.ts',
  'apps/frontend/src/lib/api/products.ts',
  'apps/frontend/src/app/products/page.tsx',
  'apps/frontend/src/app/products/[id]/page.tsx',
  'apps/frontend/src/app/admin/products/page.tsx',
  'apps/frontend/src/app/admin/orders/page.tsx',
  'apps/frontend/src/app/admin/page.tsx',
  'apps/frontend/src/app/checkout/page.tsx',
  'apps/frontend/src/app/perfil/page.tsx',
  'apps/frontend/src/components/Navbar.tsx',
  'apps/frontend/src/components/auth/RegisterForm.tsx',
  'apps/frontend/src/components/auth/ResetPasswordForm.tsx',
  'apps/frontend/src/components/auth/LoginForm.tsx',
  'apps/frontend/src/components/auth/ForgotPasswordForm.tsx',
  'apps/frontend/src/context/WishlistContext.tsx',
];

const basePath = process.cwd();

for (const relPath of filesToUpdate) {
  const fullPath = path.join(basePath, relPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    // Regex replace for the specific NEXT_PUBLIC_API_URL fallback
    content = content.replace(/process\.env\.NEXT_PUBLIC_API_URL\s*\|\|\s*["']http:\/\/localhost:3001["']/g, 'process.env.NEXT_PUBLIC_API_URL || "https://agonimports.com/api"');
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`Updated ${relPath}`);
  } else {
    console.log(`Missing ${relPath}`);
  }
}
