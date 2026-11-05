import { expect, test, type Page } from '@playwright/test';
import fs from 'node:fs';

const isMobile = (p: Page) => (p.viewportSize()?.width ?? 1000) < 1024;
const seeResult = (p: Page) => p.getByTestId(isMobile(p) ? 'see-result-m' : 'see-result');

async function openModel(page: Page, slug = 'shih-tzu') {
  await page.goto(`/racas/${slug}`);
  await page.getByTestId('try-model').click();
  await expect(page).toHaveURL(/\/provador$/);
}
async function box(page: Page, testId: string) {
  const b = await page.getByTestId(testId).boundingBox();
  if (!b) throw new Error(`sem caixa: ${testId}`);
  return b;
}

test('navegação: início → raças → filtro → detalhe', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Seu pet. Seu estilo. Sua criatividade!');
  await page.getByRole('link', { name: 'Escolher um modelo' }).click();
  await expect(page).toHaveURL(/\/racas$/);
  await page.getByRole('button', { name: 'Sem raça definida' }).click();
  await expect(page.getByTestId('breed-srd-medio')).toBeVisible();
  await expect(page.getByTestId('breed-pug')).toHaveCount(0);
  await page.getByTestId('breed-srd-medio').click();
  await expect(page.getByRole('heading', { level: 1 })).toContainText('SRD Médio');
  for (const path of ['/tosas', '/roupas', '/acessorios', '/sobre', '/privacidade', '/meus-looks', '/rota-inexistente']) {
    await page.goto(path);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test('seleção de modelo e troca de tosa muda a imagem de referência', async ({ page }) => {
  await page.goto('/racas/poodle-toy');
  await page.getByTestId('model-poodle-toy--preto').click();
  await page.getByTestId('try-model').click();
  const base = page.getByTestId('stage').locator('img').first();
  await expect(base).toHaveAttribute('src', /poodle-toy\/preto\/natural\.svg/);
  await page.getByRole('tab', { name: /Tosa/ }).click();
  await page.getByTestId('groom-asiatica').click();
  await expect(base).toHaveAttribute('src', /poodle-toy\/preto\/asiatica\.svg/);
});

test('editor: roupa, acessório, arrastar, redimensionar, girar, remover, desfazer e refazer', async ({ page }) => {
  await openModel(page);
  await page.getByTestId('add-pijama-estrelas').click();
  await expect(page.getByTestId('layer-pijama-estrelas:azul')).toBeVisible();
  // recolour keeps the same piece
  await page.getByRole('button', { name: 'Pijama Noite Estrelada Lilás' }).click();
  await expect(page.getByTestId('layer-pijama-estrelas:lilas')).toBeVisible();

  await page.getByRole('tab', { name: /Acessórios/ }).click();
  await page.getByTestId('add-oculos-escuros').click();
  const layer = 'layer-oculos-escuros';
  await expect(page.getByTestId(layer)).toBeVisible();

  // drag
  const b0 = await box(page, layer);
  await page.mouse.move(b0.x + b0.width / 2, b0.y + b0.height / 2);
  await page.mouse.down();
  await page.mouse.move(b0.x + b0.width / 2 + 60, b0.y + b0.height / 2 + 40, { steps: 6 });
  await page.mouse.up();
  const b1 = await box(page, layer);
  expect(b1.x - b0.x).toBeGreaterThan(40);
  expect(b1.y - b0.y).toBeGreaterThan(25);

  // resize with the corner handle
  const h = await box(page, 'handle-scale');
  await page.mouse.move(h.x + h.width / 2, h.y + h.height / 2);
  await page.mouse.down();
  await page.mouse.move(h.x + 70, h.y + 50, { steps: 6 });
  await page.mouse.up();
  const b2 = await box(page, layer);
  expect(b2.width).toBeGreaterThan(b1.width * 1.15);

  // rotate with the top handle
  const r = await box(page, 'handle-rotate');
  await page.mouse.move(r.x + r.width / 2, r.y + r.height / 2);
  await page.mouse.down();
  await page.mouse.move(r.x + 150, r.y + 90, { steps: 8 });
  await page.mouse.up();
  const style = await page.getByTestId(layer).getAttribute('style');
  expect(style).toMatch(/rotate\((?!0deg)/);

  // undo → previous size/rotation; redo → back
  await page.getByTestId('undo').click();
  expect(await page.getByTestId(layer).getAttribute('style')).toMatch(/rotate\(0deg\)/);
  await page.getByTestId('redo').click();
  expect(await page.getByTestId(layer).getAttribute('style')).toMatch(/rotate\((?!0deg)/);

  // remove with the × handle, undo brings it back
  await page.getByTestId('handle-remove').click();
  await expect(page.getByTestId(layer)).toHaveCount(0);
  await page.getByTestId('undo').click();
  await expect(page.getByTestId(layer)).toHaveCount(1);

  // restore original clears everything
  await page.getByTestId('restore').click();
  await expect(page.locator('[data-testid^="layer-"]')).toHaveCount(0);
});

test('upload: rejeita arquivo inválido', async ({ page }) => {
  await page.goto('/enviar-foto');
  await page.getByTestId('photo-input').setInputFiles('tests/fixtures/falso.jpg');
  await expect(page.getByTestId('upload-error')).toContainText('não é uma foto');
});

test('upload: foto própria, recorte, marcação dos olhos e acessório', async ({ page }) => {
  await page.goto('/enviar-foto');
  await page.getByTestId('photo-input').setInputFiles('tests/fixtures/cachorro.jpg');
  await expect(page.getByTestId('cropper')).toBeVisible();
  await page.getByTestId('use-photo').click();
  await expect(page).toHaveURL(/\/provador/);
  await expect(page.getByText('Toque no primeiro olho')).toBeVisible();
  const s = await box(page, 'stage');
  await page.mouse.click(s.x + s.width * 0.44, s.y + s.height * 0.4);
  await page.mouse.click(s.x + s.width * 0.56, s.y + s.height * 0.4);
  await expect(page.getByText('Toque no primeiro olho')).toHaveCount(0);
  await page.getByRole('tab', { name: /Acessórios/ }).click();
  await page.getByTestId('add-oculos-coracao').click();
  const g = await box(page, 'layer-oculos-coracao');
  // centred between the two marks
  expect(Math.abs(g.x + g.width / 2 - (s.x + s.width * 0.5))).toBeLessThan(s.width * 0.03);
  // photo is never "groomed": tosa shows references only
  await page.getByRole('tab', { name: /Tosa/ }).click();
  await expect(page.getByText('Sem IA não dá para mudar a pelagem')).toBeVisible();
});

test('resultado: exporta PNG, compartilhamento com alternativa e WhatsApp com mensagem', async ({ page }) => {
  await openModel(page, 'pug');
  await page.getByRole('tab', { name: /Acessórios/ }).click();
  await page.getByTestId('add-gravata-borboleta').click();
  await seeResult(page).click();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Olha como ficou esse estiloso!');
  await expect(page.getByTestId('result-image')).toBeVisible();
  await page.getByLabel(/Nome do pet/).fill('Pipoca');

  const [dl] = await Promise.all([page.waitForEvent('download'), page.getByTestId('download').click()]);
  expect(dl.suggestedFilename()).toBe('dogstar-pipoca.png');
  const head = fs.readFileSync((await dl.path())!).subarray(0, 8);
  expect([...head]).toEqual([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  // navigator.share is unavailable in this browser → fallback must appear
  await page.evaluate(() => { (navigator as unknown as { share?: unknown }).share = undefined; });
  await page.getByTestId('share').click();
  await expect(page.getByTestId('share-fallback')).toBeVisible();

  const href = await page.getByTestId('talk-dogstar').getAttribute('href');
  const text = decodeURIComponent(href!.split('text=')[1]);
  expect(text).toContain('Pet: Pipoca');
  expect(text).toContain('Raça: Pug');
  expect(text).toContain('Gravata-Borboleta');
});

test('salvar look, reabrir e limpar dados locais', async ({ page }) => {
  await openModel(page, 'beagle');
  await page.getByRole('tab', { name: /Acessórios/ }).click();
  await page.getByTestId('add-chapeu-palha').click();
  await page.getByTestId(isMobile(page) ? 'save-look-m' : 'save-look').click();
  await expect(page.getByText('Look salvo em Meus looks')).toBeVisible();
  await page.goto('/meus-looks');
  await expect(page.getByRole('button', { name: 'Editar' })).toHaveCount(1);
  await page.getByRole('button', { name: 'Editar' }).click();
  await expect(page.getByTestId('layer-chapeu-palha')).toBeVisible();
  await page.goto('/meus-looks');
  page.once('dialog', (d) => d.accept());
  await page.getByTestId('clear-data').click();
  await expect(page.getByText('Nenhum look salvo ainda.')).toBeVisible();
});

test('rascunho sobrevive a recarregar a página', async ({ page }) => {
  await openModel(page, 'labrador');
  await page.getByRole('tab', { name: /Acessórios/ }).click();
  await page.getByTestId('add-bandana-xadrez').click();
  await page.waitForTimeout(700);
  await page.reload();
  await expect(page.getByTestId('layer-bandana-xadrez')).toBeVisible();
});

test('responsivo: nenhuma página tem rolagem horizontal', async ({ page }) => {
  for (const path of ['/', '/comecar', '/racas', '/racas/husky-siberiano', '/tosas', '/roupas', '/acessorios', '/enviar-foto', '/sobre']) {
    await page.goto(path);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow, path).toBeLessThanOrEqual(1);
  }
});
