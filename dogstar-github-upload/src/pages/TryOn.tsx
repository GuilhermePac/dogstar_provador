import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Bookmark, Camera, Crosshair, Eraser, Layers, Loader2, PawPrint, Redo2, RotateCcw, Scissors, Shirt, Sparkles, Undo2, Glasses, ArrowRight, SlidersHorizontal } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { useStudio } from '../hooks/useStudio';
import { useToast } from '../hooks/useToast';
import { Stage, type GesturePhase } from '../components/Stage';
import { LayerControls } from '../components/studio/LayerControls';
import { AccessoriesPanel, ClothesPanel, GroomingPanel, LayersPanel } from '../components/studio/Panels';
import { getBreed, getGrooming, getModel } from '../data';
import { removeLayer, scaleLayer, updateLayer, normaliseAngle } from '../canvas/history';
import { anchorsFromEyes } from '../canvas/placement';
import { composeImage } from '../canvas/compose';
import { idbSet } from '../utils/storage';
import type { Backdrop, Layer, SavedLook } from '../types';
import { asset } from '../utils/asset';

type Tab = 'tosa' | 'roupas' | 'acessorios' | 'camadas';
const TABS: { id: Tab; label: string; icon: typeof Scissors }[] = [
  { id: 'tosa', label: 'Tosa', icon: Scissors },
  { id: 'roupas', label: 'Roupas', icon: Shirt },
  { id: 'acessorios', label: 'Acessórios', icon: Glasses },
  { id: 'camadas', label: 'Camadas', icon: Layers },
];
const BACKDROPS: { id: Backdrop; label: string; swatch: string }[] = [
  { id: 'star', label: 'Raios DogStar', swatch: 'repeating-conic-gradient(#ff7900 0 20deg,#ffa04d 20deg 40deg)' },
  { id: 'paper', label: 'Estúdio', swatch: '#efefef' },
  { id: 'white', label: 'Branco', swatch: '#fff' },
];

export default function TryOn() {
  useSeo('Provador virtual', 'Vista roupas e acessórios no seu cachorro, ajuste cada peça e salve o resultado.');
  const s = useStudio();
  const { subject, doc, selected, select, ready } = s;
  const [tab, setTab] = useState<Tab>('roupas');
  const [params, setParams] = useSearchParams();
  const [picking, setPicking] = useState(false);
  const [marks, setMarks] = useState<{ x: number; y: number }[]>([]);
  const [saving, setSaving] = useState(false);
  // mobile: the adjustments sheet opens only on request, so it never hides the gallery
  const [sheet, setSheet] = useState(false);
  const selectFromStage = useCallback((uid: string | null) => { select(uid); setSheet(!!uid); }, [select]);
  const toast = useToast();
  const nav = useNavigate();

  const model = subject?.kind === 'model' ? getModel(subject.modelId) : undefined;
  const breed = model ? getBreed(model.breed) : undefined;
  const base = model ? model.images[doc.grooming] ?? model.images.natural : s.photoUrl;
  const sel = doc.layers.find((l) => l.uid === selected) ?? null;

  useEffect(() => {
    if (subject?.kind === 'photo' && params.get('calibrar') === '1') {
      setPicking(true);
      setMarks([]);
      params.delete('calibrar');
      setParams(params, { replace: true });
    }
  }, [subject, params, setParams]);

  // gestures from the stage → one undo step per gesture
  const docRef = useRef(doc);
  docRef.current = doc;
  const onLayerChange = useCallback((uid: string, patch: Partial<Layer>, phase: GesturePhase) => {
    if (phase === 'start') s.checkpoint();
    else if (phase === 'move') s.preview(updateLayer(docRef.current, uid, patch));
    else s.settle();
  }, [s.checkpoint, s.preview, s.settle]); // eslint-disable-line react-hooks/exhaustive-deps

  const remove = useCallback((uid: string) => { s.commit(removeLayer(docRef.current, uid)); select(null); }, [s.commit, select]); // eslint-disable-line react-hooks/exhaustive-deps

  // keyboard: undo/redo everywhere, nudging when an item is selected
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (['INPUT', 'SELECT', 'TEXTAREA'].includes(t.tagName)) return;
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? s.redo() : s.undo(); return; }
      if (mod && e.key.toLowerCase() === 'y') { e.preventDefault(); s.redo(); return; }
      const l = docRef.current.layers.find((x) => x.uid === selected);
      if (!l) return;
      const step = e.shiftKey ? 25 : 6;
      let patch: Partial<Layer> | null = null;
      switch (e.key) {
        case 'ArrowLeft': patch = { x: l.x - step }; break;
        case 'ArrowRight': patch = { x: l.x + step }; break;
        case 'ArrowUp': patch = { y: l.y - step }; break;
        case 'ArrowDown': patch = { y: l.y + step }; break;
        case '+': case '=': patch = scaleLayer(l, 1.06); break;
        case '-': patch = scaleLayer(l, 1 / 1.06); break;
        case ']': patch = { rotation: normaliseAngle(l.rotation + 5) }; break;
        case '[': patch = { rotation: normaliseAngle(l.rotation - 5) }; break;
        case 'Delete': case 'Backspace': remove(l.uid); e.preventDefault(); return;
        case 'Escape': select(null); return;
      }
      if (patch) { e.preventDefault(); s.commit(updateLayer(docRef.current, l.uid, patch)); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selected, s.undo, s.redo, s.commit, select, remove]); // eslint-disable-line react-hooks/exhaustive-deps

  const onPick = (p: { x: number; y: number }) => {
    const next = [...marks, p];
    if (next.length < 2) { setMarks(next); return; }
    const [a, b] = next[0].x <= next[1].x ? next : [next[1], next[0]];
    s.setPhotoAnchors(anchorsFromEyes(a, b));
    setPicking(false);
    setMarks([]);
    toast('Pronto! Os acessórios agora encaixam no rosto do seu pet.');
  };

  const label = model
    ? `Ilustração ${breed?.name}, ${getGrooming(doc.grooming)?.name.toLowerCase()}`
    : 'Sua foto com montagem de acessórios';

  const saveLook = async () => {
    if (!subject || !base) return;
    setSaving(true);
    try {
      const thumbnail = await composeImage({ base, layers: doc.layers, backdrop: model ? doc.backdrop : null, label, size: 520, withFooter: false });
      const look: SavedLook = {
        id: `look-${Date.now()}`, createdAt: Date.now(),
        title: model ? `${breed?.name}, ${model.name}` : 'Meu pet',
        subject, doc, thumbnail, photo: subject.kind === 'photo' ? s.photoBlob ?? undefined : undefined,
      };
      await idbSet(look.id, look);
      toast('Look salvo em Meus looks, neste aparelho.');
    } catch {
      toast('Não foi possível salvar neste navegador (talvez esteja em modo privado). Você ainda pode baixar a imagem.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (!ready) {
    return <div className="container-x py-16"><div className="skeleton mx-auto aspect-square max-w-xl rounded-[var(--radius-stage)]" /></div>;
  }

  if (!subject || !base) {
    return (
      <div className="container-x flex flex-col items-center py-16 text-center">
        <img src={asset('/images/dogs/shih-tzu/branco-caramelo/bebe.svg')} alt="" className="size-48" />
        <h1 className="mt-4 text-4xl font-extrabold">Primeiro, escolha o cachorro</h1>
        <p className="mt-3 max-w-md text-lg text-ink-2">O provador precisa de um modelo de raça ou de uma foto do seu pet para começar.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/racas" className="btn btn-primary"><PawPrint className="size-5" aria-hidden /> Escolher um modelo</Link>
          <Link to="/enviar-foto" className="btn btn-dark"><Camera className="size-5" aria-hidden /> Enviar foto</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x pt-4 pb-28 lg:pt-8 lg:pb-12">
      <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_420px] lg:gap-8 xl:grid-cols-[minmax(0,1fr)_460px]">
        {/* -------- stage column */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="flex items-center justify-between gap-3">
            <h1 className="min-w-0 truncate text-2xl font-extrabold sm:text-3xl">
              {model ? breed?.name : 'Meu pet'}
              {model && <span className="ml-2 align-middle text-base font-semibold text-muted">{model.name}</span>}
            </h1>
            <div className="flex shrink-0 gap-1.5">
              <button type="button" className="btn btn-soft btn-icon" onClick={s.undo} disabled={!s.canUndo} aria-label="Desfazer" title="Desfazer (Ctrl+Z)" data-testid="undo"><Undo2 className="size-5" /></button>
              <button type="button" className="btn btn-soft btn-icon" onClick={s.redo} disabled={!s.canRedo} aria-label="Refazer" title="Refazer (Ctrl+Shift+Z)" data-testid="redo"><Redo2 className="size-5" /></button>
            </div>
          </div>

          {picking && (
            <div role="status" className="mt-3 rounded-2xl bg-ink px-4 py-3 text-sm text-white">
              <strong className="text-star">{marks.length === 0 ? 'Toque no primeiro olho' : 'Agora toque no outro olho'}</strong> do seu pet na foto, para os acessórios encaixarem.
              <button type="button" className="ml-2 underline" onClick={() => { setPicking(false); setMarks([]); }}>Pular</button>
            </div>
          )}

          <div className="mt-3">
            <Stage
              base={base}
              baseAlt={model ? `Ilustração de ${breed?.name} ${model.name}` : 'Foto do seu pet'}
              backdrop={model ? doc.backdrop : null}
              layers={doc.layers}
              editable={!picking}
              selected={selected}
              onSelect={selectFromStage}
              onLayerChange={onLayerChange}
              onRemove={remove}
              picking={picking}
              marks={marks}
              onPick={onPick}
              label="Provador: arraste os itens para posicionar"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="badge">{model ? 'Ilustração + montagem' : 'Sua foto + montagem'}</span>
            {model && (
              <div className="flex items-center gap-1.5" role="radiogroup" aria-label="Fundo">
                {BACKDROPS.map((b) => (
                  <button key={b.id} type="button" role="radio" aria-checked={doc.backdrop === b.id} aria-label={`Fundo ${b.label}`} title={b.label}
                    onClick={() => s.setBackdrop(b.id)} className="size-7 rounded-full ring-1 ring-black/15 ring-offset-2 aria-checked:ring-2 aria-checked:ring-ink" style={{ background: b.swatch }} />
                ))}
              </div>
            )}
            <div className="ml-auto flex flex-wrap gap-1.5">
              {subject.kind === 'photo' && (
                <button type="button" className="btn btn-soft btn-sm" onClick={() => { setPicking(true); setMarks([]); select(null); }} data-testid="mark-eyes">
                  <Crosshair className="size-4" aria-hidden /> Marcar olhos
                </button>
              )}
              <button type="button" className="btn btn-soft btn-sm" onClick={s.clearLayers} disabled={!doc.layers.length}><Eraser className="size-4" aria-hidden /> Limpar</button>
              <button type="button" className="btn btn-soft btn-sm" onClick={s.restoreOriginal} disabled={!doc.layers.length && doc.grooming === 'natural'} data-testid="restore"><RotateCcw className="size-4" aria-hidden /> Original</button>
            </div>
          </div>

          {sel && (
            <div className="mt-4 hidden lg:block"><LayerControls layer={sel} /></div>
          )}
        </div>

        {/* -------- panel column */}
        <div className="mt-6 lg:mt-0">
          <div role="tablist" aria-label="Personalizar" className="grid grid-cols-4 gap-1 rounded-full bg-paper p-1">
            {TABS.map((t) => (
              <button key={t.id} type="button" role="tab" id={`tab-${t.id}`} aria-selected={tab === t.id} aria-controls={`panel-${t.id}`} onClick={() => setTab(t.id)}
                className="flex min-h-11 items-center justify-center gap-1.5 rounded-full text-sm font-semibold text-ink-2 transition aria-selected:bg-white aria-selected:text-ink aria-selected:shadow-[var(--shadow-lift)]">
                <t.icon className="size-4 max-sm:hidden" aria-hidden />{t.label}
                {t.id === 'camadas' && doc.layers.length > 0 && <span className="rounded-full bg-star px-1.5 text-[0.65rem] text-ink">{doc.layers.length}</span>}
              </button>
            ))}
          </div>
          <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-4">
            {tab === 'tosa' && <GroomingPanel />}
            {tab === 'roupas' && <ClothesPanel />}
            {tab === 'acessorios' && <AccessoriesPanel />}
            {tab === 'camadas' && <LayersPanel baseThumb={base} baseName={model ? `${breed?.name} (base)` : 'Sua foto (base)'} />}
          </div>
          <div className="mt-8 hidden gap-3 lg:flex">
            <button type="button" className="btn btn-ghost flex-1" onClick={saveLook} disabled={saving} data-testid="save-look">
              {saving ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <Bookmark className="size-5" aria-hidden />} Salvar look
            </button>
            <button type="button" className="btn btn-primary flex-[1.4]" onClick={() => nav('/provador/resultado')} data-testid="see-result">
              <Sparkles className="size-5" aria-hidden /> Ver resultado <ArrowRight className="size-4" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      {/* -------- mobile: adjustments sheet + fixed bottom bar */}
      {sel && sheet && (
        <div className="fixed inset-x-0 bottom-[4.75rem] z-30 px-3 lg:hidden" style={{ animation: 'sheet-up .25s var(--ease-out-soft)' }}>
          <div className="mx-auto max-w-xl shadow-[var(--shadow-pop)] rounded-3xl"><LayerControls layer={sel} onClose={() => setSheet(false)} compact /></div>
        </div>
      )}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-3 pt-3 backdrop-blur lg:hidden" style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
        <div className="mx-auto flex max-w-xl gap-2">
          {sel && !sheet && (
            <button type="button" className="btn btn-dark flex-1" onClick={() => setSheet(true)} data-testid="adjust-m"><SlidersHorizontal className="size-5" aria-hidden /> Ajustar</button>
          )}
          <button type="button" className="btn btn-ghost btn-icon shrink-0" onClick={saveLook} disabled={saving} data-testid="save-look-m" aria-label="Salvar look" title="Salvar look">
            {saving ? <Loader2 className="size-5 animate-spin" aria-hidden /> : <Bookmark className="size-5" aria-hidden />}
          </button>
          <button type="button" className="btn btn-primary flex-[1.6] whitespace-nowrap" onClick={() => nav('/provador/resultado')} data-testid="see-result-m">
            <Sparkles className="size-5" aria-hidden /> Ver resultado
          </button>
        </div>
      </div>
    </div>
  );
}
