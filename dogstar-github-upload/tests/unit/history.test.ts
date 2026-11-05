import { describe, expect, it } from 'vitest';
import { emptyDoc, historyReducer, initHistory, moveLayer, removeLayer, updateLayer, normaliseAngle } from '../../src/canvas/history';
import { createLayer, DEFAULT_PHOTO_ANCHORS } from '../../src/canvas/placement';
import { accessoryItem, ACCESSORIES } from '../../src/data';

const layer = (id: string) => createLayer(accessoryItem(ACCESSORIES.find((a) => a.id === id)!), DEFAULT_PHOTO_ANCHORS);

describe('histórico (desfazer/refazer)', () => {
  it('commit, undo e redo', () => {
    let h = initHistory();
    const l = layer('oculos-escuros');
    h = historyReducer(h, { type: 'commit', doc: { ...emptyDoc(), layers: [l] } });
    expect(h.present.layers).toHaveLength(1);
    h = historyReducer(h, { type: 'undo' });
    expect(h.present.layers).toHaveLength(0);
    h = historyReducer(h, { type: 'redo' });
    expect(h.present.layers).toHaveLength(1);
  });

  it('um gesto contínuo vira um único passo de desfazer', () => {
    const l = layer('laco-rosa');
    let h = initHistory({ ...emptyDoc(), layers: [l] });
    h = historyReducer(h, { type: 'checkpoint' });
    for (let i = 1; i <= 20; i++) h = historyReducer(h, { type: 'preview', doc: updateLayer(h.present, l.uid, { x: l.x + i }) });
    h = historyReducer(h, { type: 'settle' });
    expect(h.past).toHaveLength(1);
    expect(h.present.layers[0].x).toBe(l.x + 20);
    h = historyReducer(h, { type: 'undo' });
    expect(h.present.layers[0].x).toBe(l.x);
  });

  it('settle descarta checkpoint sem mudança (clique sem arrastar)', () => {
    let h = initHistory();
    h = historyReducer(h, { type: 'checkpoint' });
    h = historyReducer(h, { type: 'settle' });
    expect(h.past).toHaveLength(0);
  });

  it('nova ação apaga o "refazer"', () => {
    let h = initHistory();
    h = historyReducer(h, { type: 'commit', doc: { ...emptyDoc(), grooming: 'bebe' } });
    h = historyReducer(h, { type: 'undo' });
    h = historyReducer(h, { type: 'commit', doc: { ...emptyDoc(), grooming: 'ursinho' } });
    expect(h.future).toHaveLength(0);
  });

  it('camadas: mover, remover, ajuste manual desliga o encaixe automático', () => {
    const a = layer('oculos-escuros');
    const b = layer('chapeu-fedora');
    let d = { ...emptyDoc(), layers: [a, b] };
    d = moveLayer(d, a.uid, 1);
    expect(d.layers.map((x) => x.uid)).toEqual([b.uid, a.uid]);
    expect(updateLayer(d, a.uid, { x: 1 }).layers[1].auto).toBe(false);
    expect(removeLayer(d, a.uid).layers).toHaveLength(1);
  });

  it('normaliza ângulos', () => {
    expect(normaliseAngle(190)).toBe(-170);
    expect(normaliseAngle(-190)).toBe(170);
  });
});
