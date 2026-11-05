import type { EditorDoc, Layer } from '../types';
import { clamp } from './placement';

/**
 * Undo/redo history. Continuous gestures (drag, pinch, sliders) call
 * `checkpoint` once at the start and `preview` while moving, so one gesture
 * becomes exactly one undo step. `settle` drops the checkpoint if nothing
 * actually changed.
 */
export interface History {
  past: EditorDoc[];
  present: EditorDoc;
  future: EditorDoc[];
}

export type HistoryAction =
  | { type: 'commit'; doc: EditorDoc }
  | { type: 'checkpoint' }
  | { type: 'preview'; doc: EditorDoc }
  | { type: 'settle' }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'reset'; doc: EditorDoc };

const LIMIT = 60;

export function emptyDoc(): EditorDoc {
  return { layers: [], grooming: 'natural', backdrop: 'star', photoAnchors: null };
}

export const initHistory = (doc: EditorDoc = emptyDoc()): History => ({ past: [], present: doc, future: [] });

const same = (a: EditorDoc, b: EditorDoc) => JSON.stringify(a) === JSON.stringify(b);

export function historyReducer(h: History, a: HistoryAction): History {
  switch (a.type) {
    case 'commit':
      if (same(a.doc, h.present)) return h;
      return { past: [...h.past, h.present].slice(-LIMIT), present: a.doc, future: [] };
    case 'checkpoint':
      return { past: [...h.past, h.present].slice(-LIMIT), present: h.present, future: [] };
    case 'preview':
      return { ...h, present: a.doc };
    case 'settle': {
      const last = h.past[h.past.length - 1];
      if (last && same(last, h.present)) return { ...h, past: h.past.slice(0, -1) };
      return h;
    }
    case 'undo': {
      if (!h.past.length) return h;
      const prev = h.past[h.past.length - 1];
      return { past: h.past.slice(0, -1), present: prev, future: [h.present, ...h.future] };
    }
    case 'redo': {
      if (!h.future.length) return h;
      const [next, ...rest] = h.future;
      return { past: [...h.past, h.present], present: next, future: rest };
    }
    case 'reset':
      return initHistory(a.doc);
    default:
      return h;
  }
}

/* ---------- pure layer operations ---------- */

export const updateLayer = (doc: EditorDoc, uid: string, patch: Partial<Layer>): EditorDoc => ({
  ...doc,
  layers: doc.layers.map((l) => (l.uid === uid ? { ...l, ...patch, auto: patch.auto ?? false } : l)),
});

export const removeLayer = (doc: EditorDoc, uid: string): EditorDoc => ({
  ...doc,
  layers: doc.layers.filter((l) => l.uid !== uid),
});

export function moveLayer(doc: EditorDoc, uid: string, dir: 1 | -1): EditorDoc {
  const i = doc.layers.findIndex((l) => l.uid === uid);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= doc.layers.length) return doc;
  const layers = [...doc.layers];
  [layers[i], layers[j]] = [layers[j], layers[i]];
  return { ...doc, layers };
}

export function scaleLayer(l: Layer, factor: number): Partial<Layer> {
  const w = clamp(l.w * factor, 24, 2400);
  return { w, h: (w * l.h) / l.w };
}

export const normaliseAngle = (deg: number) => {
  let a = deg % 360;
  if (a > 180) a -= 360;
  if (a <= -180) a += 360;
  return Math.round(a * 10) / 10;
};
