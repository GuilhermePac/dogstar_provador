import { useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { useStudio } from '../hooks/useStudio';
import { useToast } from '../hooks/useToast';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { ACCESSORIES, ACCESSORY_CATEGORIES, CLOTHES, CLOTHES_CATEGORIES, accessoryItem, clothingItem } from '../data';
import { MESSAGES } from '../config';
import type { Accessory, Clothing, WearableItem } from '../types';

export default function Catalog({ kind }: { kind: 'clothes' | 'accessory' }) {
  const isClothes = kind === 'clothes';
  useSeo(
    isClothes ? 'Roupas para cachorro' : 'Acessórios para cachorro',
    isClothes ? 'Pijamas, camisetas, vestidos, moletons, jaquetas e fantasias para experimentar no provador virtual da DogStar.' : 'Bandanas, laços, gravatas, óculos, chapéus, bonés, coleiras e peitorais para experimentar no provador virtual da DogStar.',
  );
  const cats = isClothes ? CLOTHES_CATEGORIES : ACCESSORY_CATEGORIES;
  const [params, setParams] = useSearchParams();
  const cat = params.get('categoria') ?? '';
  const items = useMemo(
    () => (isClothes ? CLOTHES : ACCESSORIES).filter((i) => !cat || i.category === cat),
    [isClothes, cat],
  );
  const usedCats = Object.entries(cats).filter(([id]) => (isClothes ? CLOTHES : ACCESSORIES).some((i) => i.category === id));

  return (
    <div className="container-x py-10 lg:py-14">
      <h1 className="text-[clamp(2.4rem,5vw,3.8rem)] font-extrabold">{isClothes ? 'Roupas' : 'Acessórios'}</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-2">
        {isClothes
          ? 'Escolha a cor e mande para o provador. Uma roupa por vez — acessórios dá para combinar à vontade.'
          : 'Combine quantos quiser: cada acessório já entra no lugar certo e você ajusta com o dedo ou o mouse.'}
      </p>
      <div className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none" role="group" aria-label="Categorias">
        <button type="button" className="chip" aria-pressed={!cat} onClick={() => setParams({}, { replace: true })}>Todos</button>
        {usedCats.map(([id, label]) => (
          <button key={id} type="button" className="chip" aria-pressed={cat === id} onClick={() => setParams({ categoria: id }, { replace: true })}>{label}</button>
        ))}
      </div>
      <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((i) => (isClothes ? <ClothingTile key={i.id} c={i as Clothing} /> : <AccessoryTile key={i.id} a={i as Accessory} />))}
      </ul>
    </div>
  );
}

function useTryOn() {
  const { subject, addItem, queueItem } = useStudio();
  const toast = useToast();
  const nav = useNavigate();
  return (item: WearableItem) => {
    if (subject) {
      addItem(item);
      toast(`${item.name} adicionado ao provador`);
      nav('/provador');
    } else {
      queueItem(item);
      nav('/comecar');
    }
  };
}

function ClothingTile({ c }: { c: Clothing }) {
  const [color, setColor] = useState(c.colors[0].id);
  const col = c.colors.find((x) => x.id === color)!;
  const tryOn = useTryOn();
  return (
    <li className="tile" data-testid={`item-${c.id}`}>
      <div className="tile-media flex items-center justify-center p-6">
        <img src={col.image} alt={`${c.name}, cor ${col.name}`} loading="lazy" className="max-h-full w-auto object-contain" />
      </div>
      <p className="mt-3 text-xs font-semibold text-muted">{CLOTHES_CATEGORIES[c.category]}</p>
      <h2 className="text-lg leading-tight font-bold">{c.name}</h2>
      <p className="mt-1 line-clamp-2 text-sm text-ink-2">{c.description}</p>
      <div className="mt-3 flex items-center gap-2" role="radiogroup" aria-label={`Cor de ${c.name}`}>
        {c.colors.map((x) => (
          <button key={x.id} type="button" role="radio" aria-checked={x.id === color} aria-label={x.name} title={x.name} onClick={() => setColor(x.id)}
            className="size-7 rounded-full ring-1 ring-black/15 ring-offset-2 transition aria-checked:ring-2 aria-checked:ring-ink" style={{ background: x.hex }} />
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">Tamanhos: {c.sizes.join(', ')}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="btn btn-dark btn-sm" onClick={() => tryOn(clothingItem(c, color))}>
          <Sparkles className="size-4" aria-hidden /> Provar
        </button>
        <WhatsAppButton text={`${MESSAGES.clothes}\n\nPeça: ${c.name} (${col.name})`} label="Consultar" variant="ghost" className="btn-sm" />
      </div>
    </li>
  );
}

function AccessoryTile({ a }: { a: Accessory }) {
  const tryOn = useTryOn();
  return (
    <li className="tile" data-testid={`item-${a.id}`}>
      <div className="tile-media flex items-center justify-center p-8">
        <img src={a.image} alt={a.name} loading="lazy" className="max-h-full w-auto object-contain" />
      </div>
      <p className="mt-3 text-xs font-semibold text-muted">{ACCESSORY_CATEGORIES[a.category]}</p>
      <h2 className="text-lg leading-tight font-bold">{a.name}</h2>
      <p className="mt-1 line-clamp-2 text-sm text-ink-2">{a.description}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" className="btn btn-dark btn-sm" onClick={() => tryOn(accessoryItem(a))}>
          <Sparkles className="size-4" aria-hidden /> Provar
        </button>
        <WhatsAppButton text={`${MESSAGES.accessories}\n\nItem: ${a.name}`} label="Consultar" variant="ghost" className="btn-sm" />
      </div>
    </li>
  );
}
