import { memo, useCallback, useEffect, useRef, type PointerEvent as RPE } from 'react';
import { RotateCw, Maximize2, X } from 'lucide-react';
import type { Backdrop, Layer } from '../types';
import { STAGE, clamp } from '../canvas/placement';
import { normaliseAngle } from '../canvas/history';

export type GesturePhase = 'start' | 'move' | 'end';

interface Props {
  base: string;
  baseAlt: string;
  backdrop: Backdrop | null;
  layers: Layer[];
  editable?: boolean;
  selected?: string | null;
  onSelect?: (uid: string | null) => void;
  onLayerChange?: (uid: string, patch: Partial<Layer>, phase: GesturePhase) => void;
  onRemove?: (uid: string) => void;
  /** eye-marking mode for photos */
  picking?: boolean;
  marks?: { x: number; y: number }[];
  onPick?: (p: { x: number; y: number }) => void;
  label?: string;
  className?: string;
  animateNew?: boolean;
}

type Mode = 'drag' | 'scale' | 'rotate' | 'pinch';

interface Gesture {
  mode: Mode;
  uid: string;
  start: Layer;
  pointers: Map<number, { x: number; y: number }>;
  origin: { x: number; y: number };
  d0: number;
  a0: number;
  moved: boolean;
}

const BACKDROP_CLASS: Record<Backdrop, string> = {
  star: 'stage-backdrop',
  paper: 'stage-backdrop-paper',
  white: 'stage-backdrop-white',
};

export const Stage = memo(function Stage({
  base, baseAlt, backdrop, layers, editable = false, selected = null, onSelect, onLayerChange, onRemove,
  picking = false, marks = [], onPick, label, className = '', animateNew = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const g = useRef<Gesture | null>(null);
  const layersRef = useRef(layers);
  layersRef.current = layers;

  const scale = () => (ref.current ? ref.current.getBoundingClientRect().width / STAGE : 1);
  const toStage = (clientX: number, clientY: number) => {
    const r = ref.current!.getBoundingClientRect();
    return { x: ((clientX - r.left) / r.width) * STAGE, y: ((clientY - r.top) / r.height) * STAGE };
  };
  const centerOnScreen = (l: Layer) => {
    const r = ref.current!.getBoundingClientRect();
    const k = r.width / STAGE;
    return { x: r.left + l.x * k, y: r.top + l.y * k };
  };

  const onMove = useCallback((e: PointerEvent) => {
    const s = g.current;
    if (!s) return;
    if (!s.pointers.has(e.pointerId)) return;
    s.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const l = s.start;
    let patch: Partial<Layer> = {};
    if (s.mode === 'pinch' && s.pointers.size >= 2) {
      const [p1, p2] = [...s.pointers.values()];
      const d = Math.hypot(p2.x - p1.x, p2.y - p1.y);
      const a = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
      const k = clamp(d / s.d0, 0.15, 8);
      const w = clamp(l.w * k, 24, 2400);
      const mid = { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
      const sc = scale();
      patch = {
        w, h: (w * l.h) / l.w,
        rotation: normaliseAngle(l.rotation + (a - s.a0)),
        x: l.x + (mid.x - s.origin.x) / sc,
        y: l.y + (mid.y - s.origin.y) / sc,
      };
    } else if (s.mode === 'drag') {
      const p = [...s.pointers.values()][0];
      const sc = scale();
      patch = {
        x: clamp(l.x + (p.x - s.origin.x) / sc, -200, STAGE + 200),
        y: clamp(l.y + (p.y - s.origin.y) / sc, -200, STAGE + 200),
      };
    } else if (s.mode === 'scale') {
      const p = [...s.pointers.values()][0];
      const c = centerOnScreen(l);
      const d = Math.hypot(p.x - c.x, p.y - c.y);
      const w = clamp(l.w * (d / s.d0), 24, 2400);
      patch = { w, h: (w * l.h) / l.w };
    } else if (s.mode === 'rotate') {
      const p = [...s.pointers.values()][0];
      const c = centerOnScreen(l);
      const a = (Math.atan2(p.y - c.y, p.x - c.x) * 180) / Math.PI;
      let rot = normaliseAngle(l.rotation + (a - s.a0));
      for (const snap of [0, 90, -90, 180]) if (Math.abs(rot - snap) < 4) rot = snap; // gentle snapping
      patch = { rotation: rot };
    }
    s.moved = true;
    onLayerChange?.(s.uid, patch, 'move');
  }, [onLayerChange]); // eslint-disable-line react-hooks/exhaustive-deps

  const onUp = useCallback((e: PointerEvent) => {
    const s = g.current;
    if (!s) return;
    s.pointers.delete(e.pointerId);
    if (s.mode === 'pinch' && s.pointers.size === 1) {
      // continue as a drag with the remaining finger
      const cur = layersRef.current.find((x) => x.uid === s.uid);
      if (cur) {
        const p = [...s.pointers.values()][0];
        g.current = { ...s, mode: 'drag', start: cur, origin: p };
      }
      return;
    }
    if (s.pointers.size === 0) {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      g.current = null;
      onLayerChange?.(s.uid, {}, 'end');
    }
  }, [onLayerChange, onMove]);

  useEffect(() => () => {
    window.removeEventListener('pointermove', onMove);
    window.removeEventListener('pointerup', onUp);
    window.removeEventListener('pointercancel', onUp);
  }, [onMove, onUp]);

  const begin = (e: RPE, layer: Layer, mode: Mode) => {
    if (!editable) return;
    e.stopPropagation();
    e.preventDefault();
    const existing = g.current;
    if (existing && existing.uid === layer.uid && existing.pointers.size === 1 && mode === 'drag') {
      // second finger → pinch (scale + rotate)
      existing.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const [p1, p2] = [...existing.pointers.values()];
      const cur = layersRef.current.find((x) => x.uid === layer.uid) ?? layer;
      g.current = {
        ...existing, mode: 'pinch', start: cur,
        d0: Math.max(10, Math.hypot(p2.x - p1.x, p2.y - p1.y)),
        a0: (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI,
        origin: { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 },
      };
      return;
    }
    if (existing) return;
    onSelect?.(layer.uid);
    const c = centerOnScreen(layer);
    g.current = {
      mode, uid: layer.uid, start: layer,
      pointers: new Map([[e.pointerId, { x: e.clientX, y: e.clientY }]]),
      origin: { x: e.clientX, y: e.clientY },
      d0: Math.max(8, Math.hypot(e.clientX - c.x, e.clientY - c.y)),
      a0: (Math.atan2(e.clientY - c.y, e.clientX - c.x) * 180) / Math.PI,
      moved: false,
    };
    onLayerChange?.(layer.uid, {}, 'start');
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  };

  const sel = layers.find((l) => l.uid === selected);
  const pct = (v: number) => `${v / 10}%`;
  const box = (l: Layer) => ({ left: pct(l.x - l.w / 2), top: pct(l.y - l.h / 2), width: pct(l.w), height: pct(l.h), transform: `rotate(${l.rotation}deg)` });

  return (
    <div
      ref={ref}
      data-testid="stage"
      className={`relative aspect-square w-full touch-none select-none ${className}`}
      onPointerDown={(e) => {
        if (picking && onPick) { onPick(toStage(e.clientX, e.clientY)); return; }
        // second finger landing outside the item still pinches the selected item
        const active = g.current;
        if (editable && active && active.pointers.size === 1) {
          const l = layersRef.current.find((x) => x.uid === active.uid);
          if (l) { begin(e, l, 'drag'); return; }
        }
        if (e.target === e.currentTarget || (e.target as HTMLElement).dataset.bg) onSelect?.(null);
      }}
      aria-label={label}
      role="group"
    >
      {/* clipped picture: backdrop + base + layers */}
      <div className={`absolute inset-0 overflow-hidden rounded-[var(--radius-stage)] ${backdrop ? BACKDROP_CLASS[backdrop] : 'bg-white'}`} data-bg="1">
        <img src={base} alt={baseAlt} className="absolute inset-0 size-full object-contain" draggable={false} data-bg="1" />
        {layers.map((l) => (
          <div
            key={l.uid}
            data-testid={`layer-${l.key}`}
            role={editable ? 'button' : undefined}
            tabIndex={editable ? 0 : undefined}
            aria-label={editable ? `${l.name}${l.uid === selected ? ' (selecionado)' : ''}` : undefined}
            aria-pressed={editable ? l.uid === selected : undefined}
            className={`absolute ${editable ? 'cursor-grab active:cursor-grabbing' : ''} ${animateNew ? 'animate-drop-in' : ''}`}
            style={{ ...box(l), opacity: l.opacity }}
            onPointerDown={(e) => begin(e, l, 'drag')}
            onFocus={() => editable && onSelect?.(l.uid)}
          >
            <img src={l.src} alt="" draggable={false} className="pointer-events-none size-full" style={{ transform: l.flipX ? 'scaleX(-1)' : undefined }} />
          </div>
        ))}
      </div>

      {/* selection frame (not clipped, so handles stay reachable near edges) */}
      {editable && sel && (
        <div className="pointer-events-none absolute" style={box(sel)} data-testid="selection">
          <div className="absolute -inset-1 rounded-lg border-2 border-dashed border-ink/80" />
          <button
            type="button" aria-label="Girar" data-testid="handle-rotate"
            className="pointer-events-auto absolute -top-12 left-1/2 flex size-9 -translate-x-1/2 cursor-grab items-center justify-center rounded-full bg-white text-ink shadow-[var(--shadow-pop)] ring-1 ring-line"
            onPointerDown={(e) => begin(e, sel, 'rotate')}
          >
            <RotateCw className="size-4" aria-hidden />
          </button>
          <div className="absolute -top-3 left-1/2 h-3 w-0.5 -translate-x-1/2 bg-ink/60" />
          <button
            type="button" aria-label="Redimensionar" data-testid="handle-scale"
            className="pointer-events-auto absolute -right-4 -bottom-4 flex size-9 cursor-nwse-resize items-center justify-center rounded-full bg-ink text-white shadow-[var(--shadow-pop)]"
            onPointerDown={(e) => begin(e, sel, 'scale')}
          >
            <Maximize2 className="size-4" aria-hidden />
          </button>
          <button
            type="button" aria-label={`Remover ${sel.name}`} data-testid="handle-remove"
            className="pointer-events-auto absolute -top-4 -right-4 flex size-9 items-center justify-center rounded-full bg-white text-danger shadow-[var(--shadow-pop)] ring-1 ring-line"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onRemove?.(sel.uid)}
          >
            <X className="size-4" aria-hidden />
          </button>
        </div>
      )}

      {picking && (
        <div className="pointer-events-none absolute inset-0 rounded-[var(--radius-stage)] ring-4 ring-star ring-inset">
          {marks.map((m, i) => (
            <span key={i} className="absolute flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-star text-xs font-bold text-ink ring-4 ring-white" style={{ left: pct(m.x), top: pct(m.y) }}>
              {i === 0 ? 'E' : 'D'}
            </span>
          ))}
        </div>
      )}
    </div>
  );
});
