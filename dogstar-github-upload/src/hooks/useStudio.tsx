import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState, type ReactNode } from 'react';
import type { Anchors, Backdrop, EditorDoc, Layer, SavedLook, Subject, WearableItem } from '../types';
import { emptyDoc, historyReducer, initHistory, type History } from '../canvas/history';
import { createLayer, DEFAULT_PHOTO_ANCHORS, fitItem, insertLayer } from '../canvas/placement';
import { findWearable, getModel } from '../data';
import { idbDel, idbGet, idbSet } from '../utils/storage';

interface Draft { subject: Subject; doc: EditorDoc }

interface StudioCtx {
  ready: boolean;
  subject: Subject | null;
  history: History;
  doc: EditorDoc;
  selected: string | null;
  photoUrl: string | null;
  photoBlob: Blob | null;
  anchors: Anchors;
  canUndo: boolean;
  canRedo: boolean;
  pending: WearableItem[];
  select: (uid: string | null) => void;
  commit: (doc: EditorDoc) => void;
  checkpoint: () => void;
  preview: (doc: EditorDoc) => void;
  settle: () => void;
  undo: () => void;
  redo: () => void;
  startWithModel: (modelId: string, grooming?: string) => void;
  startWithPhoto: (blob: Blob) => Promise<void>;
  addItem: (item: WearableItem) => Layer | null;
  queueItem: (item: WearableItem) => void;
  setGrooming: (id: string) => void;
  setBackdrop: (b: Backdrop) => void;
  setPhotoAnchors: (a: Anchors | null) => void;
  restoreOriginal: () => void;
  clearLayers: () => void;
  loadLook: (look: SavedLook) => Promise<void>;
  endSession: () => Promise<void>;
}

const Ctx = createContext<StudioCtx | null>(null);

function anchorsFor(subject: Subject | null, doc: EditorDoc): Anchors {
  if (subject?.kind === 'model') {
    const m = getModel(subject.modelId);
    return m?.anchors?.[doc.grooming] ?? m?.anchors?.natural ?? DEFAULT_PHOTO_ANCHORS;
  }
  return doc.photoAnchors ?? DEFAULT_PHOTO_ANCHORS;
}

/** Re-fit layers that the visitor hasn't moved yet. */
function refit(doc: EditorDoc, anchors: Anchors): EditorDoc {
  return {
    ...doc,
    layers: doc.layers.map((l) => {
      if (!l.auto) return l;
      const fit = fitFromLayer(l);
      return fit ? { ...l, ...fitItem(fit, anchors) } : l;
    }),
  };
}

const fitFromLayer = (l: Layer) => findWearable(l.key);

export function StudioProvider({ children }: { children: ReactNode }) {
  const [history, dispatch] = useReducer(historyReducer, undefined, () => initHistory());
  const [subject, setSubject] = useState<Subject | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [photoBlob, setPhotoBlob] = useState<Blob | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [pending, setPending] = useState<WearableItem[]>([]);
  const [ready, setReady] = useState(false);
  const doc = history.present;
  const anchors = useMemo(() => anchorsFor(subject, doc), [subject, doc]);

  // keep a single object URL for the photo
  useEffect(() => {
    if (!photoBlob) { setPhotoUrl(null); return; }
    const url = URL.createObjectURL(photoBlob);
    setPhotoUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [photoBlob]);

  // restore the draft saved on this device
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const draft = await idbGet<Draft>('draft');
        if (!alive || !draft) return;
        if (draft.subject.kind === 'photo') {
          const blob = await idbGet<Blob>('photo:current');
          if (!blob) return;
          setPhotoBlob(blob);
        } else if (!getModel(draft.subject.modelId)) return;
        setSubject(draft.subject);
        dispatch({ type: 'reset', doc: draft.doc });
      } catch { /* storage unavailable: start fresh */ } finally {
        if (alive) setReady(true);
      }
    })();
    return () => { alive = false; };
  }, []);

  // autosave the draft (debounced)
  const saveTimer = useRef<number>(0);
  useEffect(() => {
    if (!ready || !subject) return;
    window.clearTimeout(saveTimer.current);
    saveTimer.current = window.setTimeout(() => {
      idbSet('draft', { subject, doc }).catch(() => undefined);
    }, 400);
  }, [doc, subject, ready]);

  const docRef = useRef(doc);
  docRef.current = doc;
  const subjectRef = useRef(subject);
  subjectRef.current = subject;

  const commit = useCallback((d: EditorDoc) => dispatch({ type: 'commit', doc: d }), []);

  const applyPending = useCallback((base: EditorDoc, subj: Subject) => {
    if (!pending.length) return base;
    const a = anchorsFor(subj, base);
    let layers = base.layers;
    for (const item of pending) layers = insertLayer(layers, createLayer(item, a));
    setPending([]);
    return { ...base, layers };
  }, [pending]);

  const startWithModel = useCallback((modelId: string, grooming = 'natural') => {
    const m = getModel(modelId);
    if (!m) return;
    const subj: Subject = { kind: 'model', modelId };
    const prev = docRef.current;
    const g = m.images[grooming] ? grooming : 'natural';
    let next: EditorDoc = { ...emptyDoc(), backdrop: prev.backdrop, grooming: g };
    // keep what was already being tried on, re-fitted to the new dog
    if (subjectRef.current) {
      next.layers = prev.layers.map((l) => ({ ...l, auto: true }));
      next = refit(next, anchorsFor(subj, next));
    }
    next = applyPending(next, subj);
    setSubject(subj);
    setSelected(null);
    dispatch({ type: 'reset', doc: next });
  }, [applyPending]);

  const startWithPhoto = useCallback(async (blob: Blob) => {
    const subj: Subject = { kind: 'photo', photoId: `p${Date.now()}` };
    try { await idbSet('photo:current', blob); } catch { /* still works in memory */ }
    setPhotoBlob(blob);
    let next: EditorDoc = { ...emptyDoc(), backdrop: 'white' };
    if (subjectRef.current) {
      next.layers = docRef.current.layers.map((l) => ({ ...l, auto: true }));
      next = refit(next, anchorsFor(subj, next));
    }
    next = applyPending(next, subj);
    setSubject(subj);
    setSelected(null);
    dispatch({ type: 'reset', doc: next });
  }, [applyPending]);

  const addItem = useCallback((item: WearableItem) => {
    if (!subjectRef.current) return null;
    const d = docRef.current;
    const a = anchorsFor(subjectRef.current, d);
    // one garment at a time: a new piece of clothing replaces the old one
    const base = item.kind === 'clothes' ? d.layers.filter((l) => l.kind !== 'clothes') : d.layers;
    const layer = createLayer(item, a);
    commit({ ...d, layers: insertLayer(base, layer) });
    setSelected(layer.uid);
    return layer;
  }, [commit]);

  const queueItem = useCallback((item: WearableItem) => {
    setPending((p) => (p.some((x) => x.key === item.key) ? p : [...p, item]));
  }, []);

  const setGrooming = useCallback((id: string) => {
    const d = { ...docRef.current, grooming: id };
    commit(refit(d, anchorsFor(subjectRef.current, d)));
  }, [commit]);

  const setBackdrop = useCallback((b: Backdrop) => commit({ ...docRef.current, backdrop: b }), [commit]);

  const setPhotoAnchors = useCallback((a: Anchors | null) => {
    const d = { ...docRef.current, photoAnchors: a, layers: docRef.current.layers.map((l) => ({ ...l, auto: true })) };
    commit(refit(d, a ?? DEFAULT_PHOTO_ANCHORS));
  }, [commit]);

  const restoreOriginal = useCallback(() => {
    setSelected(null);
    commit({ ...docRef.current, layers: [], grooming: 'natural' });
  }, [commit]);

  const clearLayers = useCallback(() => {
    setSelected(null);
    commit({ ...docRef.current, layers: [] });
  }, [commit]);

  const loadLook = useCallback(async (look: SavedLook) => {
    if (look.subject.kind === 'photo' && look.photo) {
      try { await idbSet('photo:current', look.photo); } catch { /* ignore */ }
      setPhotoBlob(look.photo);
    }
    setSubject(look.subject);
    setSelected(null);
    dispatch({ type: 'reset', doc: look.doc });
  }, []);

  const endSession = useCallback(async () => {
    setSubject(null);
    setPhotoBlob(null);
    setSelected(null);
    dispatch({ type: 'reset', doc: emptyDoc() });
    try { await idbDel('draft'); await idbDel('photo:current'); } catch { /* ignore */ }
  }, []);

  const value: StudioCtx = {
    ready, subject, history, doc, selected, photoUrl, photoBlob, anchors, pending,
    canUndo: history.past.length > 0,
    canRedo: history.future.length > 0,
    select: setSelected,
    commit,
    checkpoint: useCallback(() => dispatch({ type: 'checkpoint' }), []),
    preview: useCallback((d: EditorDoc) => dispatch({ type: 'preview', doc: d }), []),
    settle: useCallback(() => dispatch({ type: 'settle' }), []),
    undo: useCallback(() => dispatch({ type: 'undo' }), []),
    redo: useCallback(() => dispatch({ type: 'redo' }), []),
    startWithModel, startWithPhoto, addItem, queueItem, setGrooming, setBackdrop,
    setPhotoAnchors, restoreOriginal, clearLayers, loadLook, endSession,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStudio() {
  const c = useContext(Ctx);
  if (!c) throw new Error('useStudio fora do StudioProvider');
  return c;
}
