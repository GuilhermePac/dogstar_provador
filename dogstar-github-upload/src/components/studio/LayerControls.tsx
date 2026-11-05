import { useRef } from 'react';
import { ArrowDown, ArrowUp, FlipHorizontal2, LocateFixed, Trash2, X } from 'lucide-react';
import type { Layer } from '../../types';
import { useStudio } from '../../hooks/useStudio';
import { moveLayer, removeLayer, updateLayer } from '../../canvas/history';
import { fitItem } from '../../canvas/placement';
import { findWearable } from '../../data';

/** Slider that turns a whole drag into one undo step. */
function GestureSlider({ id, label, value, min, max, step = 1, suffix = '', onValue }: {
  id: string; label: string; value: number; min: number; max: number; step?: number; suffix?: string; onValue: (v: number) => void;
}) {
  const { checkpoint, settle } = useStudio();
  const active = useRef(false);
  const start = () => { if (!active.current) { active.current = true; checkpoint(); } };
  const end = () => { if (active.current) { active.current = false; settle(); } };
  return (
    <div>
      <div className="flex items-center justify-between text-sm">
        <label htmlFor={id} className="font-semibold">{label}</label>
        <span className="tabular-nums text-muted">{Math.round(value)}{suffix}</span>
      </div>
      <input
        id={id} type="range" min={min} max={max} step={step} value={value}
        onPointerDown={start} onKeyDown={start} onFocus={() => undefined}
        onPointerUp={end} onKeyUp={end} onBlur={end}
        onChange={(e) => { start(); onValue(+e.target.value); }}
        className="mt-1 w-full accent-[var(--color-star)]"
      />
    </div>
  );
}

export function LayerControls({ layer, onClose, compact = false }: { layer: Layer; onClose?: () => void; compact?: boolean }) {
  const { doc, commit, preview, select, anchors } = useStudio();
  const idx = doc.layers.findIndex((l) => l.uid === layer.uid);
  const live = (patch: Partial<Layer>) => preview(updateLayer(doc, layer.uid, patch));
  const pct = Math.round((layer.w / (autoWidth(layer, anchors) || layer.w)) * 100);

  const refit = () => {
    const item = findWearable(layer.key);
    if (item) commit(updateLayer(doc, layer.uid, { ...fitItem(item, anchors), auto: true, opacity: 1, flipX: false }));
  };

  return (
    <div className="rounded-3xl bg-white p-4 ring-1 ring-line" data-testid="layer-controls">
      <div className="flex items-center gap-3">
        <img src={layer.src} alt="" className="size-10 rounded-xl bg-paper object-contain p-1" />
        <div className="min-w-0 flex-1">
          <p className="truncate font-bold">{layer.name}</p>
          <p className="truncate text-xs text-muted">{layer.category}{layer.colorName ? `, ${layer.colorName}` : ''}</p>
        </div>
        {onClose && (
          <button type="button" className="btn btn-soft btn-icon min-h-9 w-9" aria-label="Fechar ajustes" onClick={onClose}><X className="size-4" /></button>
        )}
      </div>
      <div className={`mt-4 grid gap-4 ${compact ? 'grid-cols-2' : ''}`}>
        <GestureSlider id="sl-size" label="Tamanho" value={pct} min={20} max={300} suffix="%" onValue={(v) => {
          const w = (autoWidth(layer, anchors) || layer.w) * (v / 100);
          live({ w, h: (w * layer.h) / layer.w });
        }} />
        <GestureSlider id="sl-rot" label="Rotação" value={layer.rotation} min={-180} max={180} suffix="°" onValue={(v) => live({ rotation: v })} />
        {!compact && <GestureSlider id="sl-op" label="Opacidade" value={layer.opacity * 100} min={15} max={100} suffix="%" onValue={(v) => live({ opacity: v / 100 })} />}
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn btn-soft btn-sm" onClick={() => commit(updateLayer(doc, layer.uid, { flipX: !layer.flipX }))}><FlipHorizontal2 className="size-4" aria-hidden /> Espelhar</button>
        <button type="button" className="btn btn-soft btn-sm" disabled={idx >= doc.layers.length - 1} onClick={() => commit(moveLayer(doc, layer.uid, 1))} aria-label="Trazer para frente"><ArrowUp className="size-4" aria-hidden /> Frente</button>
        <button type="button" className="btn btn-soft btn-sm" disabled={idx <= 0} onClick={() => commit(moveLayer(doc, layer.uid, -1))} aria-label="Mandar para trás"><ArrowDown className="size-4" aria-hidden /> Trás</button>
        <button type="button" className="btn btn-soft btn-sm" onClick={refit}><LocateFixed className="size-4" aria-hidden /> Recolocar</button>
        <button type="button" className="btn btn-soft btn-sm text-danger" onClick={() => { commit(removeLayer(doc, layer.uid)); select(null); }}><Trash2 className="size-4" aria-hidden /> Remover</button>
      </div>
    </div>
  );
}

function autoWidth(layer: Layer, anchors: Parameters<typeof fitItem>[1]) {
  const item = findWearable(layer.key);
  return item ? fitItem(item, anchors).w : 0;
}
