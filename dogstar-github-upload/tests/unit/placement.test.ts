import { describe, expect, it } from 'vitest';
import { anchorsFromEyes, fitItem, insertLayer, createLayer, STAGE } from '../../src/canvas/placement';
import { ACCESSORIES, CLOTHES, accessoryItem, clothingItem, getModel } from '../../src/data';

const glasses = accessoryItem(ACCESSORIES.find((a) => a.id === 'oculos-escuros')!);

describe('encaixe automático', () => {
  it('óculos ficam centrados nos olhos do modelo', () => {
    const a = getModel('pug--abricot')!.anchors.natural;
    const f = fitItem(glasses, a);
    expect(f.x).toBeCloseTo(a.eyes.x * STAGE, 0);
    expect(f.y).toBeCloseTo(a.eyes.y * STAGE, 0);
    expect(f.w).toBeGreaterThan(a.eyes.w * STAGE); // wider than eye distance
  });

  it('marcação dos olhos acompanha a inclinação da cabeça', () => {
    const a = anchorsFromEyes({ x: 400, y: 400 }, { x: 600, y: 500 });
    const f = fitItem(glasses, a);
    expect(f.rotation).toBeCloseTo((Math.atan2(100, 200) * 180) / Math.PI, 0);
    expect(a.neck.y).toBeGreaterThan(a.eyes.y);
    expect(a.head.y).toBeLessThan(a.eyes.y);
  });

  it('roupas sempre ficam embaixo dos acessórios', () => {
    const a = anchorsFromEyes({ x: 420, y: 380 }, { x: 580, y: 380 });
    let layers = insertLayer([], createLayer(glasses, a));
    layers = insertLayer(layers, createLayer(clothingItem(CLOTHES[0]), a));
    expect(layers[0].kind).toBe('clothes');
  });
});
