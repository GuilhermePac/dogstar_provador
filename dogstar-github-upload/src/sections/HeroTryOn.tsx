import { useMemo, useState } from 'react';
import { Stage } from '../components/Stage';
import { createLayer, insertLayer } from '../canvas/placement';
import { ACCESSORIES, CLOTHES, accessoryItem, clothingItem, getModel } from '../data';
import type { Layer, WearableItem } from '../types';

const MODEL_ID = 'shih-tzu--branco-caramelo';
const GROOMS = [
  { id: 'natural', label: 'Natural' },
  { id: 'bebe', label: 'Bebê' },
  { id: 'ursinho', label: 'Ursinho' },
];
const PICKS: WearableItem[] = [
  accessoryItem(ACCESSORIES.find((a) => a.id === 'oculos-escuros')!),
  accessoryItem(ACCESSORIES.find((a) => a.id === 'bandana-laranja-estrelas')!),
  accessoryItem(ACCESSORIES.find((a) => a.id === 'laco-rosa')!),
  accessoryItem(ACCESSORIES.find((a) => a.id === 'bone-laranja')!),
  clothingItem(CLOTHES.find((c) => c.id === 'moletom-capuz')!, 'cinza'),
];

/** Small live version of the provador — the hero of the home page. */
export function HeroTryOn() {
  const model = getModel(MODEL_ID)!;
  const [grooming, setGrooming] = useState('bebe');
  const [on, setOn] = useState<string[]>(['oculos-escuros', 'bandana-laranja-estrelas']);
  const anchors = model.anchors[grooming];

  const layers = useMemo(() => {
    let ls: Layer[] = [];
    for (const item of PICKS) {
      if (!on.includes(item.key)) continue;
      // keep stable uids so toggling one item doesn't re-animate the others
      ls = insertLayer(ls, { ...createLayer(item, anchors), uid: item.key });
    }
    return ls;
  }, [on, anchors]);

  const toggle = (key: string) =>
    setOn((cur) => {
      if (cur.includes(key)) return cur.filter((k) => k !== key);
      // cap and bow compete for the top of the head
      const clash = key === 'bone-laranja' ? 'laco-rosa' : key === 'laco-rosa' ? 'bone-laranja' : '';
      return [...cur.filter((k) => k !== clash), key];
    });

  return (
    <div className="relative mx-auto w-full max-w-[560px]">
      <Stage base={model.images[grooming]} baseAlt="Ilustração de Shih Tzu branco e caramelo" backdrop="star" layers={layers} animateNew label="Demonstração do provador" className="drop-shadow-[0_30px_40px_rgba(17,17,17,0.12)]" />
      <div className="relative z-10 -mt-10 mx-3 rounded-3xl bg-white p-4 shadow-[var(--shadow-pop)] sm:mx-8">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none" role="group" aria-label="Tosa">
          <span className="mr-1 shrink-0 text-sm font-semibold text-muted">Tosa</span>
          {GROOMS.map((g) => (
            <button key={g.id} type="button" className="chip" aria-pressed={grooming === g.id} onClick={() => setGrooming(g.id)}>{g.label}</button>
          ))}
        </div>
        <div className="-m-1 mt-2 flex items-center gap-2 overflow-x-auto p-1 scrollbar-none" role="group" aria-label="Acessórios">
          {PICKS.map((p) => (
            <button key={p.key} type="button" aria-pressed={on.includes(p.key)} onClick={() => toggle(p.key)} className="group relative size-14 shrink-0 rounded-2xl bg-paper p-2 ring-2 ring-transparent transition aria-pressed:bg-star-50 aria-pressed:ring-star" title={p.name}>
              <img src={p.image} alt={p.name} className="size-full object-contain" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
