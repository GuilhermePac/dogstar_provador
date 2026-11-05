import { useState } from 'react';
import { Check, Info, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { useStudio } from '../../hooks/useStudio';
import { useToast } from '../../hooks/useToast';
import {
  ACCESSORIES, ACCESSORY_CATEGORIES, CLOTHES, CLOTHES_CATEGORIES, GROOMING,
  accessoryItem, clothingItem, getBreed, getModel,
} from '../../data';
import { moveLayer, removeLayer, updateLayer } from '../../canvas/history';
import type { Clothing } from '../../types';

function CategoryChips({ cats, value, onChange }: { cats: [string, string][]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 scrollbar-none" role="group" aria-label="Categorias">
      <button type="button" className="chip min-h-9" aria-pressed={!value} onClick={() => onChange('')}>Todos</button>
      {cats.map(([id, label]) => (
        <button key={id} type="button" className="chip min-h-9" aria-pressed={value === id} onClick={() => onChange(id)}>{label}</button>
      ))}
    </div>
  );
}

const thumbGrid = 'grid auto-cols-[5.5rem] grid-flow-col gap-3 overflow-x-auto pb-2 scrollbar-none lg:grid-flow-row lg:grid-cols-3 lg:auto-cols-auto lg:overflow-visible';

/* ---------------- Tosa ---------------- */
export function GroomingPanel() {
  const { subject, doc, setGrooming, commit } = useStudio();
  const toast = useToast();
  if (subject?.kind === 'model') {
    const model = getModel(subject.modelId)!;
    const breed = getBreed(model.breed)!;
    const ids = Object.keys(model.images);
    return (
      <div>
        <p className="mb-3 flex gap-2 text-sm text-ink-2"><Info className="mt-0.5 size-4 shrink-0 text-star" aria-hidden />Ilustrações prontas de cada estilo para {breed.name}. Não é uma transformação em tempo real.</p>
        <div className={thumbGrid} role="radiogroup" aria-label="Estilo de tosa">
          {ids.map((g) => (
            <button key={g} type="button" role="radio" aria-checked={doc.grooming === g} onClick={() => setGrooming(g)} data-testid={`groom-${g}`}
              className="rounded-2xl bg-paper p-1.5 text-left ring-2 ring-transparent transition aria-checked:bg-star-50 aria-checked:ring-star">
              <img src={model.images[g]} alt="" className="aspect-square w-full" loading="lazy" />
              <span className="block truncate px-1 pb-0.5 text-xs font-semibold">{GROOMING.find((x) => x.id === g)?.short}</span>
            </button>
          ))}
        </div>
        {ids.length <= 2 && <p className="mt-2 text-sm text-muted">Essa pelagem pede só banho e tosa higiênica — capriche nas roupas e acessórios!</p>}
      </div>
    );
  }
  // photo: references only, the photo itself is never altered
  return (
    <div>
      <p className="mb-3 flex gap-2 text-sm text-ink-2"><Info className="mt-0.5 size-4 shrink-0 text-star" aria-hidden />Sem IA não dá para mudar a pelagem da sua foto de forma realista. Veja a referência e marque a tosa que você quer — ela vai junto na mensagem para a DogStar.</p>
      <div className={thumbGrid}>
        {GROOMING.filter((g) => g.id !== 'natural').map((g) => {
          const on = doc.grooming === g.id;
          return (
            <button key={g.id} type="button" aria-pressed={on} data-testid={`groom-${g.id}`}
              onClick={() => { commit({ ...doc, grooming: on ? 'natural' : g.id }); if (!on) toast(`${g.name} marcada como desejada`); }}
              className="relative rounded-2xl bg-paper p-1.5 text-left ring-2 ring-transparent transition aria-pressed:bg-star-50 aria-pressed:ring-star">
              <img src={g.reference} alt="" className="aspect-square w-full" loading="lazy" />
              <span className="block truncate px-1 pb-0.5 text-xs font-semibold">{g.short}</span>
              <span className="absolute top-2 left-2 rounded-full bg-white/90 px-1.5 text-[0.65rem] font-semibold">Referência</span>
              {on && <Check className="absolute top-2 right-2 size-5 rounded-full bg-star p-0.5 text-white" aria-hidden />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Roupas ---------------- */
export function ClothesPanel() {
  const { doc, addItem, commit, select } = useStudio();
  const [cat, setCat] = useState('');
  const cats = Object.entries(CLOTHES_CATEGORIES).filter(([id]) => CLOTHES.some((c) => c.category === id));
  const current = doc.layers.find((l) => l.kind === 'clothes');

  const toggle = (c: Clothing, colorId?: string) => {
    if (current && current.itemId === c.id && (!colorId || current.key === `${c.id}:${colorId}`)) {
      commit(removeLayer(doc, current.uid));
      select(null);
      return;
    }
    if (current && current.itemId === c.id && colorId) {
      // recolour in place, keeping the visitor's adjustments
      const item = clothingItem(c, colorId);
      commit(updateLayer(doc, current.uid, { key: item.key, src: item.image, colorName: item.colorName, auto: current.auto }));
      return;
    }
    addItem(clothingItem(c, colorId));
  };

  return (
    <div className="flex flex-col gap-3">
      <CategoryChips cats={cats} value={cat} onChange={setCat} />
      <div className={thumbGrid}>
        {CLOTHES.filter((c) => !cat || c.category === cat).map((c) => {
          const on = current?.itemId === c.id;
          const shown = on ? c.colors.find((x) => current!.key.endsWith(`:${x.id}`)) ?? c.colors[0] : c.colors[0];
          return (
            <div key={c.id} className="flex flex-col gap-1.5">
              <button type="button" aria-pressed={on} onClick={() => toggle(c)} data-testid={`add-${c.id}`} title={c.name}
                className="relative aspect-square rounded-2xl bg-paper p-2 ring-2 ring-transparent transition aria-pressed:bg-star-50 aria-pressed:ring-star">
                <img src={shown.image} alt={c.name} className="size-full object-contain" loading="lazy" />
                {on && <Check className="absolute top-1.5 right-1.5 size-5 rounded-full bg-star p-0.5 text-white" aria-hidden />}
              </button>
              {c.colors.length > 1 && (
                <div className="flex justify-center gap-1.5">
                  {c.colors.map((x) => (
                    <button key={x.id} type="button" aria-label={`${c.name} ${x.name}`} title={x.name} onClick={() => toggle(c, x.id)}
                      className={`size-5 rounded-full ring-1 ring-black/15 ${on && shown.id === x.id ? 'ring-2 ring-ink ring-offset-1' : ''}`} style={{ background: x.hex }} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Acessórios ---------------- */
export function AccessoriesPanel() {
  const { doc, addItem, commit, select } = useStudio();
  const [cat, setCat] = useState('');
  const cats = Object.entries(ACCESSORY_CATEGORIES).filter(([id]) => ACCESSORIES.some((a) => a.category === id));
  return (
    <div className="flex flex-col gap-3">
      <CategoryChips cats={cats} value={cat} onChange={setCat} />
      <div className={thumbGrid}>
        {ACCESSORIES.filter((a) => !cat || a.category === cat).map((a) => {
          const existing = doc.layers.find((l) => l.key === a.id);
          return (
            <button key={a.id} type="button" aria-pressed={!!existing} title={a.name} data-testid={`add-${a.id}`}
              onClick={() => {
                if (existing) { commit(removeLayer(doc, existing.uid)); select(null); } else addItem(accessoryItem(a));
              }}
              className="relative aspect-square rounded-2xl bg-paper p-3 ring-2 ring-transparent transition aria-pressed:bg-star-50 aria-pressed:ring-star">
              <img src={a.image} alt={a.name} className="size-full object-contain" loading="lazy" />
              {existing && <Check className="absolute top-1.5 right-1.5 size-5 rounded-full bg-star p-0.5 text-white" aria-hidden />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ---------------- Camadas ---------------- */
export function LayersPanel({ baseThumb, baseName }: { baseThumb: string; baseName: string }) {
  const { doc, selected, select, commit } = useStudio();
  const list = [...doc.layers].reverse(); // top first
  return (
    <div>
      {list.length === 0 && <p className="mb-3 text-sm text-ink-2">Ainda não há roupas nem acessórios. Escolha algo nas outras abas.</p>}
      <ol className="flex flex-col gap-2" aria-label="Camadas, da frente para trás">
        {list.map((l, i) => {
          const realIdx = doc.layers.length - 1 - i;
          return (
            <li key={l.uid} className={`flex items-center gap-2 rounded-2xl p-2 ${selected === l.uid ? 'bg-star-50 ring-2 ring-star' : 'bg-paper'}`}>
              <button type="button" className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={() => select(l.uid)}>
                <img src={l.src} alt="" className="size-10 rounded-xl bg-white object-contain p-1" />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-semibold">{l.name}</span>
                  <span className="block text-xs text-muted">Camada {realIdx + 2}</span>
                </span>
              </button>
              <button type="button" className="btn btn-icon min-h-9 w-9 bg-white" aria-label={`Trazer ${l.name} para frente`} disabled={realIdx === doc.layers.length - 1} onClick={() => commit(moveLayer(doc, l.uid, 1))}><ArrowUp className="size-4" /></button>
              <button type="button" className="btn btn-icon min-h-9 w-9 bg-white" aria-label={`Mandar ${l.name} para trás`} disabled={realIdx === 0} onClick={() => commit(moveLayer(doc, l.uid, -1))}><ArrowDown className="size-4" /></button>
              <button type="button" className="btn btn-icon min-h-9 w-9 bg-white text-danger" aria-label={`Remover ${l.name}`} onClick={() => { commit(removeLayer(doc, l.uid)); if (selected === l.uid) select(null); }}><Trash2 className="size-4" /></button>
            </li>
          );
        })}
        <li className="flex items-center gap-3 rounded-2xl border border-dashed border-line p-2">
          <img src={baseThumb} alt="" className="size-10 rounded-xl bg-paper object-cover" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold">{baseName}</span>
            <span className="block text-xs text-muted">Camada 1, fixa</span>
          </span>
        </li>
      </ol>
    </div>
  );
}
