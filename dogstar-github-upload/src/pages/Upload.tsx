import { useCallback, useEffect, useRef, useState, type PointerEvent as RPE } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ImagePlus, Loader2, Lock, RotateCw, ZoomIn, ZoomOut, Lightbulb } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { useStudio } from '../hooks/useStudio';
import { useToast } from '../hooks/useToast';
import { checkImageFile, loadImage, MIN_SIDE, prepareImage } from '../utils/image';
import { clamp } from '../canvas/placement';

const OUT = 1200;

const TIPS = [
  ['Luz boa', 'Perto de uma janela, sem flash estourado.'],
  ['De frente ou 3/4', 'Olhos visíveis ajudam a encaixar óculos, laços e chapéus.'],
  ['Rosto livre', 'Sem mãos, brinquedos ou coleira cobrindo a carinha.'],
  ['Corpo à mostra', 'Para provar roupas, enquadre do focinho até as patas da frente.'],
];

export default function Upload() {
  useSeo('Enviar foto do meu pet', 'Envie uma foto do seu cachorro para experimentar roupas e acessórios. A imagem é processada só no seu aparelho.');
  const [img, setImg] = useState<HTMLImageElement | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { startWithPhoto } = useStudio();
  const nav = useNavigate();
  const toast = useToast();
  const urlRef = useRef<string | null>(null);

  useEffect(() => () => { if (urlRef.current) URL.revokeObjectURL(urlRef.current); }, []);

  const handleFile = async (file?: File | null) => {
    if (!file) return;
    setError(null);
    const check = await checkImageFile(file);
    if (!check.ok) { setError(check.reason); return; }
    setBusy(true);
    try {
      const { blob, width, height } = await prepareImage(file);
      if (Math.min(width, height) < MIN_SIDE) {
        setError(`A foto é muito pequena (${width}×${height}). Use uma imagem com pelo menos ${MIN_SIDE} px no lado menor.`);
        return;
      }
      if (urlRef.current) URL.revokeObjectURL(urlRef.current);
      urlRef.current = URL.createObjectURL(blob);
      setImg(await loadImage(urlRef.current));
    } catch {
      setError('Não conseguimos abrir essa foto. Tente outra imagem JPG, PNG ou WebP.');
    } finally {
      setBusy(false);
    }
  };

  const confirm = async (blob: Blob) => {
    await startWithPhoto(blob);
    toast('Foto pronta! Marque os olhos para os acessórios encaixarem sozinhos.', 'info');
    nav('/provador?calibrar=1');
  };

  return (
    <div className="container-x py-10 lg:py-14">
      <h1 className="text-[clamp(2.4rem,5vw,3.8rem)] font-extrabold">{img ? 'Enquadre a foto' : 'Envie a foto do seu pet'}</h1>
      <p className="mt-3 flex max-w-2xl items-start gap-2 text-lg text-ink-2">
        <Lock className="mt-1.5 size-5 shrink-0 text-star" aria-hidden />
        A foto é processada só neste aparelho: não enviamos para nenhum servidor nem serviço externo.
      </p>

      {!img ? (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <label
              htmlFor="photo"
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files?.[0]); }}
              className="flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-4 rounded-[var(--radius-stage)] border-2 border-dashed border-[#cfcfcf] bg-paper p-8 text-center transition-colors hover:border-star hover:bg-star-50"
            >
              {busy ? <Loader2 className="size-12 animate-spin text-star" aria-hidden /> : <ImagePlus className="size-12 text-star" aria-hidden />}
              <span className="font-display text-2xl font-bold">{busy ? 'Preparando a foto…' : 'Toque para escolher uma foto'}</span>
              <span className="text-ink-2">ou arraste a imagem para cá. JPG, PNG ou WebP até 15 MB.</span>
            </label>
            <input ref={inputRef} id="photo" data-testid="photo-input" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }} />
            {error && <p role="alert" className="mt-4 rounded-2xl bg-[#fdeceb] px-4 py-3 text-danger" data-testid="upload-error">{error}</p>}
          </div>
          <aside aria-labelledby="tips">
            <h2 id="tips" className="flex items-center gap-2 text-2xl font-bold"><Lightbulb className="size-6 text-star" aria-hidden /> Para ficar perfeito</h2>
            <ul className="mt-5 space-y-4">
              {TIPS.map(([t, d]) => (
                <li key={t} className="flex gap-3">
                  <Check className="mt-1 size-5 shrink-0 text-ok" aria-hidden />
                  <span><strong>{t}.</strong> <span className="text-ink-2">{d}</span></span>
                </li>
              ))}
            </ul>
            <p className="mt-6 rounded-2xl bg-paper p-4 text-sm text-ink-2">
              Na sua foto dá para provar roupas e acessórios. Tosas aparecem como referência ao lado — sem inteligência artificial, não dá para mudar a pelagem da foto de forma realista, então não fingimos.
            </p>
          </aside>
        </div>
      ) : (
        <Cropper img={img} onCancel={() => setImg(null)} onConfirm={confirm} />
      )}
    </div>
  );
}

function Cropper({ img, onCancel, onConfirm }: { img: HTMLImageElement; onCancel: () => void; onConfirm: (b: Blob) => void }) {
  const frame = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState(400);
  const [zoom, setZoom] = useState(1);
  const [rot, setRot] = useState(0);
  const [off, setOff] = useState({ x: 0, y: 0 });
  const [saving, setSaving] = useState(false);
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const pinch = useRef<{ d: number; z: number } | null>(null);

  useEffect(() => {
    const el = frame.current!;
    const ro = new ResizeObserver(() => setSize(el.clientWidth));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const turned = rot % 180 !== 0;
  const iw = turned ? img.naturalHeight : img.naturalWidth;
  const ih = turned ? img.naturalWidth : img.naturalHeight;
  const cover = Math.max(size / iw, size / ih);
  const s = cover * zoom;

  const limit = useCallback((o: { x: number; y: number }, z = zoom) => {
    const sc = cover * z;
    const mx = Math.max(0, (iw * sc - size) / 2);
    const my = Math.max(0, (ih * sc - size) / 2);
    return { x: clamp(o.x, -mx, mx), y: clamp(o.y, -my, my) };
  }, [cover, iw, ih, size, zoom]);

  useEffect(() => { setOff((o) => limit(o)); }, [zoom, rot, size, limit]);

  const down = (e: RPE) => {
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinch.current = { d: Math.hypot(b.x - a.x, b.y - a.y), z: zoom };
    }
  };
  const move = (e: RPE) => {
    const prev = pointers.current.get(e.pointerId);
    if (!prev) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinch.current) {
      const [a, b] = [...pointers.current.values()];
      setZoom(clamp((pinch.current.z * Math.hypot(b.x - a.x, b.y - a.y)) / pinch.current.d, 1, 5));
    } else if (pointers.current.size === 1) {
      setOff((o) => limit({ x: o.x + e.clientX - prev.x, y: o.y + e.clientY - prev.y }));
    }
  };
  const up = (e: RPE) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2) pinch.current = null;
  };

  const save = async () => {
    setSaving(true);
    try {
      const c = document.createElement('canvas');
      c.width = OUT;
      c.height = OUT;
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, OUT, OUT);
      const k = OUT / size;
      ctx.translate(OUT / 2 + off.x * k, OUT / 2 + off.y * k);
      ctx.rotate((rot * Math.PI) / 180);
      ctx.scale(s * k, s * k);
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
      const blob = await new Promise<Blob>((res, rej) => c.toBlob((b) => (b ? res(b) : rej(new Error('crop'))), 'image/jpeg', 0.92));
      onConfirm(blob);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,560px)_1fr]">
      <div>
        <div
          ref={frame}
          data-testid="cropper"
          className="relative aspect-square w-full cursor-grab touch-none overflow-hidden rounded-[var(--radius-stage)] bg-ink active:cursor-grabbing"
          onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
          onWheel={(e) => setZoom((z) => clamp(z * (e.deltaY < 0 ? 1.08 : 0.92), 1, 5))}
        >
          <img src={img.src} alt="Sua foto" draggable={false} className="pointer-events-none absolute top-1/2 left-1/2 max-w-none"
            style={{ width: img.naturalWidth, height: img.naturalHeight, transform: `translate(-50%, -50%) translate(${off.x}px, ${off.y}px) rotate(${rot}deg) scale(${s})` }} />
          {/* rule-of-thirds guide */}
          <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3" aria-hidden>
            {Array.from({ length: 9 }, (_, i) => <div key={i} className="border border-white/25" />)}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <p className="text-ink-2">Arraste para posicionar e use o zoom (ou dois dedos) para enquadrar. Deixe o cachorro centralizado, com o rosto no terço de cima.</p>
        <div className="flex items-center gap-3">
          <ZoomOut className="size-5 text-muted" aria-hidden />
          <label htmlFor="zoom" className="sr-only">Zoom</label>
          <input id="zoom" type="range" min={1} max={5} step={0.01} value={zoom} onChange={(e) => setZoom(+e.target.value)} className="w-full accent-[var(--color-star)]" />
          <ZoomIn className="size-5 text-muted" aria-hidden />
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn btn-soft" onClick={() => setRot((r) => (r + 90) % 360)}><RotateCw className="size-5" aria-hidden /> Girar 90°</button>
          <button type="button" className="btn btn-ghost" onClick={onCancel}>Trocar foto</button>
        </div>
        <button type="button" className="btn btn-primary h-14 text-base" onClick={save} disabled={saving} data-testid="use-photo">
          {saving ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <Check className="size-5" aria-hidden />} Usar esta foto
        </button>
      </div>
    </div>
  );
}
