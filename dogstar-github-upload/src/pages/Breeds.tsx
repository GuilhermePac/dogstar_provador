import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { BREEDS, BREED_FILTERS, getGrooming } from '../data';
import { asset } from '../utils/asset';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function Breeds() {
  useSeo('Galeria de raças', 'Escolha um modelo de cachorro por porte, tipo de pelo ou sem raça definida para usar no provador virtual da DogStar.');
  const [params, setParams] = useSearchParams();
  const filter = params.get('filtro') ?? 'todos';
  const tosa = params.get('tosa');
  const [q, setQ] = useState('');
  const groom = tosa ? getGrooming(tosa) : undefined;

  const list = useMemo(() => {
    const f = BREED_FILTERS.find((x) => x.id === filter) ?? BREED_FILTERS[0];
    return BREEDS.filter((b) => f.test(b) && (!q || norm(b.name).includes(norm(q))) && (!groom || b.groomings.includes(groom.id)));
  }, [filter, q, groom]);

  const setFilter = (id: string) => {
    const next = new URLSearchParams(params);
    if (id === 'todos') next.delete('filtro'); else next.set('filtro', id);
    setParams(next, { replace: true });
  };

  return (
    <div className="container-x py-10 lg:py-14">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-[clamp(2.4rem,5vw,3.8rem)] font-extrabold">Escolha o seu modelo</h1>
          <p className="mt-3 max-w-xl text-lg text-ink-2">
            {groom ? <>Raças que combinam com a <strong>{groom.name.toLowerCase()}</strong>. </> : null}
            Toque numa raça para ver as cores disponíveis e as tosas que combinam com a pelagem.
          </p>
        </div>
        <label className="relative w-full lg:w-80">
          <span className="sr-only">Buscar raça</span>
          <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" aria-hidden />
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar raça" className="field pl-12" />
        </label>
      </div>

      <div className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-none" role="group" aria-label="Filtrar raças">
        {BREED_FILTERS.map((f) => (
          <button key={f.id} type="button" className="chip" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</button>
        ))}
        {groom && (
          <button type="button" className="chip" aria-pressed onClick={() => { const n = new URLSearchParams(params); n.delete('tosa'); setParams(n); }}>
            {groom.short} ✕
          </button>
        )}
      </div>

      {list.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <img src={asset('/images/dogs/srd-medio/caramelo/natural.svg')} alt="" className="size-40 opacity-80" />
          <p className="mt-4 text-xl font-semibold">Nenhuma raça com esse nome por aqui.</p>
          <p className="mt-1 text-ink-2">Tente outro nome ou escolha um SRD — vira-lata combina com tudo.</p>
          <button type="button" className="btn btn-ghost mt-6" onClick={() => { setQ(''); setFilter('srd'); }}>Ver vira-latas</button>
        </div>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {list.map((b) => (
            <li key={b.slug}>
              <Link to={`/racas/${b.slug}${tosa ? `?tosa=${tosa}` : ''}`} className="tile block" data-testid={`breed-${b.slug}`}>
                <div className="tile-media">
                  <img src={b.cover} alt={`Ilustração de ${b.name}`} loading="lazy" decoding="async" width={800} height={800} className="size-full object-contain p-2" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-ink-2">{b.models.length} {b.models.length === 1 ? 'modelo' : 'modelos'}</span>
                </div>
                <h2 className="mt-3 text-lg leading-tight font-bold">{b.name}</h2>
                <p className="mt-0.5 text-sm text-muted">{b.srd ? 'Sem raça definida' : b.sizeLabel} · {b.coatLabel}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
