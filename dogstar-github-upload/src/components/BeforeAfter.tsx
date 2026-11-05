import { useId, useRef, useState, type PointerEvent as RPE } from 'react';

/** Drag (or use the keyboard) to compare two images of the same size. */
export function BeforeAfter({ before, after, beforeLabel = 'Antes', afterLabel = 'Depois', alt, className = '', backdrop = 'bg-paper' }: {
  before: string; after: string; beforeLabel?: string; afterLabel?: string; alt: string; className?: string; backdrop?: string;
}) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const id = useId();
  const move = (e: RPE) => {
    const r = ref.current!.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((e.clientX - r.left) / r.width) * 100)));
  };
  return (
    <div
      ref={ref}
      className={`relative aspect-square touch-pan-y select-none overflow-hidden rounded-[var(--radius-tile)] ${backdrop} ${className}`}
      onPointerDown={(e) => { (e.target as Element).setPointerCapture?.(e.pointerId); move(e); }}
      onPointerMove={(e) => { if (e.buttons) move(e); }}
    >
      <img src={after} alt={`${alt} — ${afterLabel}`} className="absolute inset-0 size-full object-contain" loading="lazy" draggable={false} />
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <img src={before} alt={`${alt} — ${beforeLabel}`} className={`absolute inset-0 size-full object-contain ${backdrop}`} loading="lazy" draggable={false} />
      </div>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 bg-ink" style={{ left: `${pos}%` }}>
        <div className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-ink text-white shadow-[var(--shadow-pop)]" aria-hidden>
          ⇆
        </div>
      </div>
      <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold">{beforeLabel}</span>
      <span className="absolute top-3 right-3 rounded-full bg-ink px-3 py-1 text-xs font-semibold text-white">{afterLabel}</span>
      <label htmlFor={id} className="sr-only">Comparar {beforeLabel} e {afterLabel}</label>
      <input id={id} type="range" min={0} max={100} value={Math.round(pos)} onChange={(e) => setPos(+e.target.value)} className="absolute inset-x-0 bottom-0 h-8 w-full cursor-ew-resize opacity-0 focus-visible:opacity-30" />
    </div>
  );
}
