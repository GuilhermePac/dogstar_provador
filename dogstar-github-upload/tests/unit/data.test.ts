import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { ACCESSORIES, BREEDS, CLOTHES, GROOMING, MODELS, getBreed, groomingsFor } from '../../src/data';

const pub = (p: string) => path.join(__dirname, '../../public', p);

describe('biblioteca de dados', () => {
  it('raças prioritárias e SRD estão cadastradas', () => {
    for (const s of ['shih-tzu', 'yorkshire', 'spitz-alemao', 'golden-retriever', 'labrador', 'rottweiler', 'doberman', 'bernese', 'shiba-inu', 'boston-terrier']) expect(getBreed(s)).toBeTruthy();
    expect(BREEDS.some((b) => b.srd)).toBe(true);
  });
  it('cada raça tem modelos e cada modelo tem imagem + pontos de encaixe por tosa', () => {
    for (const b of BREEDS) {
      expect(b.models.length).toBeGreaterThan(0);
      for (const id of b.models) {
        const m = MODELS.find((x) => x.id === id)!;
        expect(m).toBeTruthy();
        expect(Object.keys(m.images).sort()).toEqual([...b.groomings].sort());
        for (const g of b.groomings) {
          expect(fs.existsSync(pub(m.images[g]))).toBe(true);
          expect(m.anchors[g].eyes.w).toBeGreaterThan(0);
        }
      }
    }
  });
  it('modelos diferentes não reutilizam a mesma imagem', () => {
    const all = MODELS.flatMap((m) => Object.values(m.images).map((p) => fs.readFileSync(pub(p), 'utf8')));
    expect(new Set(all).size).toBe(all.length);
  });
  it('roupas e acessórios têm imagem transparente existente', () => {
    for (const c of CLOTHES) for (const col of c.colors) expect(fs.existsSync(pub(col.image))).toBe(true);
    for (const a of ACCESSORIES) expect(fs.existsSync(pub(a.image))).toBe(true);
    expect(fs.readFileSync(pub(ACCESSORIES[0].image), 'utf8')).not.toMatch(/<rect[^>]*width="100%"/);
  });
  it('tosas compatíveis vêm primeiro e pelo curto não recebe tosa de máquina', () => {
    const { compatible, other } = groomingsFor('labrador');
    expect(compatible.map((g) => g.id)).toContain('higienica');
    expect(other.map((g) => g.id)).toContain('maquina');
    expect(GROOMING.length).toBeGreaterThanOrEqual(10);
  });
});
