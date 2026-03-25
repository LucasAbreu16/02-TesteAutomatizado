import { test, expect } from '@playwright/test';

test.describe('QS Acadêmico — Testes do Sistema de Notas', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://lucasabreu16.github.io/02-TesteAutomatizado/');
    await page.waitForLoadState('networkidle');
  });

  // ========== GRUPO 1: Cadastro de Alunos ==========

  test.describe('Cadastro de Alunos', () => {

    test('deve cadastrar um aluno com dados válidos', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('João Silva');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('6');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Verificar que o aluno aparece na tabela
await expect(page.locator('#tabela-alunos').getByText('João Silva')).toBeVisible();
    });

    test('deve exibir mensagem de sucesso após cadastro', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Ana Costa');
      await page.getByLabel('Nota 1').fill('9');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await expect(page.locator('#mensagem')).toContainText('cadastrado com sucesso');
    });

    test('não deve cadastrar aluno sem nome', async ({ page }) => {
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('6');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // A tabela deve continuar sem dados reais
      await expect(page.locator('#tabela-alunos tbody td.texto-central')).toBeVisible();
    });

  });

  // ========== GRUPO 2: Cálculo de Média ==========

  test.describe('Cálculo de Média', () => {

    test('deve calcular a média aritmética das três notas', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Pedro Santos');
      await page.getByLabel('Nota 1').fill('8');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('10');

      await page.getByRole('button', { name: 'Cadastrar' }).click();

      // Média esperada: (8 + 6 + 10) / 3 = 8.00
      const celulaMedia = page.locator('#tabela-alunos tbody tr').first().locator('td').nth(4);
      await expect(celulaMedia).toHaveText('8.00');
    });
});

// 3: Validação de Notas
test.describe('Validação de Notas', () => {

    test('deve rejeitar nota maior que 10', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Carlos');
      await page.getByLabel('Nota 1').fill('11');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('7');
  
      await page.getByRole('button', { name: 'Cadastrar' }).click();
  
      await expect(page.locator('#mensagem')).toContainText('As notas devem estar entre 0 e 10.');
      await page.waitForTimeout(500);
    });
  
    test('deve rejeitar nota menor que 0', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Marina');
      await page.getByLabel('Nota 1').fill('-1');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('7');
  
      await page.getByRole('button', { name: 'Cadastrar' }).click();
  
      await expect(page.locator('#mensagem')).toContainText('As notas devem estar entre 0 e 10.');
    });
  
  });

  //4: Busca por Nome
  test.describe('Busca de Alunos', () => {

    test('deve filtrar aluno pelo nome', async ({ page }) => {
      // Cadastro 1
      await page.getByLabel('Nome do Aluno').fill('João');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('7');
      await page.getByLabel('Nota 3').fill('7');
      await page.getByRole('button', { name: 'Cadastrar' }).click();
  
      // Cadastro 2
      await page.getByLabel('Nome do Aluno').fill('Maria');
      await page.getByLabel('Nota 1').fill('8');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('8');
      await page.getByRole('button', { name: 'Cadastrar' }).click();
  
      // Busca
      await page.getByPlaceholder('Filtrar alunos...').fill('Maria');
  
      const linhas = page.locator('#tabela-alunos tbody tr');
      await expect(linhas).toHaveCount(1);
      await expect(page.locator('#tabela-alunos')).toContainText('Maria');
    });
  
  });

  //5: Exclusão
  test.describe('Exclusão de Alunos', () => {

    test('deve excluir um aluno da tabela', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Lucas');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('7');
      await page.getByLabel('Nota 3').fill('7');
  
      await page.getByRole('button', { name: 'Cadastrar' }).click();

      await page.locator('button.btn-excluir').click();
  
      await expect(page.locator('#tabela-alunos')).toContainText('Nenhum aluno cadastrado');
    });
  
  });

  //6: Estatísticas
test.describe('Estatísticas', () => {

  test('deve contabilizar corretamente aprovados, recuperação e reprovados', async ({ page }) => {

    // Aprovado
    await page.locator('#nome').fill('Aprovado');
    await page.locator('#nota1').fill('8');
    await page.locator('#nota2').fill('8');
    await page.locator('#nota3').fill('8');
    await page.getByRole('button', { name: 'Cadastrar' }).click();

    await expect(page.locator('#stat-aprovados')).toHaveText('1');

    // Recuperação
    await page.locator('#nome').fill('Recuperacao');
    await page.locator('#nota1').fill('6');
    await page.locator('#nota2').fill('5');
    await page.locator('#nota3').fill('5');
    await page.getByRole('button', { name: 'Cadastrar' }).click();

    await expect(page.locator('#stat-recuperacao')).toHaveText('1');

    // Reprovado
    await page.locator('#nome').fill('Reprovado');
    await page.locator('#nota1').fill('3');
    await page.locator('#nota2').fill('4');
    await page.locator('#nota3').fill('2');
    await page.getByRole('button', { name: 'Cadastrar' }).click();

    await expect(page.locator('#stat-reprovados')).toHaveText('1');

  });

});
  //7: Situação do Aluno - Aprovado, Reprovado e recuperação

  test.describe('Situação do Aluno', () => {

    test('deve exibir "Aprovado"', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Aluno Aprovado');
      await page.getByLabel('Nota 1').fill('7');
      await page.getByLabel('Nota 2').fill('8');
      await page.getByLabel('Nota 3').fill('9');
  
      await page.getByRole('button', { name: 'Cadastrar' }).click();
      const linha = page.locator('#tabela-alunos tbody tr').first();
      await expect(linha).toContainText('Aprovado');
      
    });
  
    test('deve exibir "Recuperação"', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Aluno Recuperacao');
      await page.getByLabel('Nota 1').fill('5');
      await page.getByLabel('Nota 2').fill('6');
      await page.getByLabel('Nota 3').fill('5');
  
      await page.getByRole('button', { name: 'Cadastrar' }).click();
      const linha = page.locator('#tabela-alunos tbody tr').first();
      await expect(linha).toContainText('Recuperação');
    });
  
    test('deve exibir "Reprovado"', async ({ page }) => {
      await page.getByLabel('Nome do Aluno').fill('Aluno Reprovado');
      await page.getByLabel('Nota 1').fill('3');
      await page.getByLabel('Nota 2').fill('4');
      await page.getByLabel('Nota 3').fill('2');
  
      await page.getByRole('button', { name: 'Cadastrar' }).click();
      const linha = page.locator('#tabela-alunos tbody tr').first();
      await expect(linha).toContainText('Reprovado');
    });
  
  });

  //8: Múltiplos Cadastros

  test.describe('Múltiplos Cadastros', () => {

    test('deve cadastrar 3 alunos', async ({ page }) => {
  
      const alunos = ['Ana', 'Bruno', 'Carlos'];
  
      for (const nome of alunos) {
        await page.getByLabel('Nome do Aluno').fill(nome);
        await page.getByLabel('Nota 1').fill('7');
        await page.getByLabel('Nota 2').fill('7');
        await page.getByLabel('Nota 3').fill('7');
  
        await page.getByRole('button', { name: 'Cadastrar' }).click();
      }
  
      await expect(page.locator('#tabela-alunos tbody tr')).toHaveCount(3);
    });
  
  });
  });