import { test, expect } from '@playwright/test';

test.describe('Cadastro de Alunos', () => {

  test('deve cadastrar, buscar e excluir aluno', async ({ page }) => {

    await page.goto('https://lucasabreu16.github.io/02-TesteAutomatizado/');

    // Cadastro 1
    await page.locator('#nome').fill('Ana Silva');
    await page.locator('#nota1').fill('8');
    await page.locator('#nota2').fill('7');
    await page.locator('#nota3').fill('9');
    await page.getByRole('button', { name: 'Cadastrar' }).click();

    // Valida cadastro
    await expect(page.locator('#tabela-alunos')).toContainText('Ana Silva');

    // Cadastro 2
    await page.locator('#nome').fill('Carlos Lima');
    await page.locator('#nota1').fill('5');
    await page.locator('#nota2').fill('4');
    await page.locator('#nota3').fill('6');
    await page.getByRole('button', { name: 'Cadastrar' }).click();

    await expect(page.locator('#tabela-alunos')).toContainText('Carlos Lima');

    // Busca
    await page.locator('#busca').fill('Ana');

    const linhas = page.locator('#tabela-alunos tbody tr');
    await expect(linhas).toHaveCount(1);
    await expect(linhas.first()).toContainText('Ana Silva');

    // Limpa busca
    await page.locator('#busca').fill('');

    // Excluir Carlos
    await page.locator('button.btn-excluir').last().click();
    // Valida exclusão
    await expect(page.locator('#tabela-alunos')).not.toContainText('Carlos Lima');

    // evita erro de After Hooks
    await page.waitForTimeout(300);
  });

});