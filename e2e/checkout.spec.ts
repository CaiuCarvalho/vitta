import { test, expect } from '@playwright/test';

test.describe('Agon Checkout Flow', () => {
  test('should allow a user to register, login, add to cart and see checkout', async ({ page }) => {
    // 1. Registro (Simulado)
    await page.goto('/login?view=register');
    await page.fill('input[name="name"]', 'Test User');
    await page.fill('input[name="email"]', `test${Date.now()}@example.com`);
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // 2. Aguarda redirecionamento ou estado logado
    await expect(page).toHaveURL('/');
    
    // 3. Adicionar ao Carrinho
    await page.goto('/products');
    // Clica no primeiro card de produto (Adicionar Rápido)
    const firstProduct = page.locator('button:has-text("Adicionar Rápido")').first();
    await firstProduct.click();

    // 4. Abrir Carrinho
    await page.click('button:has-text("Carrinho")'); // Ajustar selector se necessário
    await page.click('a:has-text("Finalizar Compra")');

    // 5. Pagina de Checkout
    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.locator('h1')).toContainText(/CHECKOUT/i);
    
    // 6. Preencher dados de entrega (Smart Checkout)
    // Supondo que campos de endereço apareçam se não existirem
    await page.fill('input[name="zipCode"]', '01310-100');
    await page.fill('input[name="street"]', 'Avenida Paulista');
    await page.fill('input[name="number"]', '1000');
    
    // 7. Selecionar Pagamento e Finalizar
    await page.click('button:has-text("Pagar com Pix")');
    
    // 8. Sucesso (Redirecionamento para processamento de pagamento)
    // Opcional: testar se QR code aparece ou se redireciona para Abacate Pay
  });
});
