import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronLeft, Info, Sparkles } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { useStudio } from '../hooks/useStudio';
import { getBreed, getGrooming, modelsOf } from '../data';
import NotFound from './NotFound';

export default function BreedDetail() {
  const { slug = '' } = useParams();
  const [params] = useSearchParams();
  const breed = getBreed(slug);
  const models = modelsOf(slug);
  const [modelId, setModelId] = useState(models[0]?.id);
  const wanted = params.get('tosa');
  const [grooming, setGrooming] = useState(wanted && breed?.groomings.includes(wanted) ? wanted : 'natural');
  const { startWithModel } = useStudio();
  const nav = useNavigate();
  useSeo(breed ? `${breed.name} no provador virtual` : 'Raça não encontrada', breed ? `${breed.description} Experimente tosas, roupas e acessórios no ${breed.name}.` : 'Raça não encontrada.');
  useEffect(() => { setModelId(models[0]?.id); }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!breed || !models.length) return <NotFound />;
  const model = models.find((m) => m.id === modelId) ?? models[0];

  const go = () => {
    startWithModel(model.id, grooming);
    nav('/provador');
  };

  return (
    <div className="container-x py-8 lg:py-12">
      <Link to="/racas" className="inline-flex items-center gap-1 text-sm font-semibold text-ink-2 hover:text-star-600">
        <ChevronLeft className="size-4" aria-hidden /> Todas as raças
      </Link>
      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14">
        <div>
          <div className="relative aspect-square overflow-hidden rounded-[var(--radius-stage)] bg-paper">
            <img key={model.images[grooming]} src={model.images[grooming] ?? model.images.natural} alt={`${breed.name}, ${model.name}, ${getGrooming(grooming)?.name}`} className="animate-fade size-full object-contain" />
            <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold">Ilustração · {getGrooming(grooming)?.name}</span>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-star-600">{breed.srd ? 'Sem raça definida' : breed.sizeLabel} · {breed.coatLabel}</p>
          <h1 className="mt-2 text-[clamp(2.2rem,4.5vw,3.4rem)] font-extrabold">{breed.name}</h1>
          <p className="mt-4 text-lg text-ink-2">{breed.description}</p>
          <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-muted">Origem</dt><dd className="font-semibold">{breed.origin}</dd></div>
            <div><dt className="text-muted">Características</dt><dd className="font-semibold">{breed.traits.join(', ')}</dd></div>
          </dl>

          <h2 className="mt-8 text-xl font-bold">Modelo</h2>
          <div className="mt-3 grid grid-cols-3 gap-3 sm:grid-cols-4" role="radiogroup" aria-label="Modelo">
            {models.map((m) => (
              <button key={m.id} type="button" role="radio" aria-checked={m.id === model.id} onClick={() => setModelId(m.id)} data-testid={`model-${m.id}`}
                className="group rounded-2xl bg-paper p-2 text-left ring-2 ring-transparent transition aria-checked:bg-star-50 aria-checked:ring-star">
                <img src={m.images.natural} alt="" className="aspect-square w-full" loading="lazy" />
                <span className="mt-1 flex items-center gap-1.5 px-1 text-xs font-semibold">
                  <span className="flex -space-x-1">{m.swatches.slice(0, 2).map((c) => <span key={c} className="size-3 rounded-full ring-1 ring-black/15" style={{ background: c }} />)}</span>
                  {m.name}
                </span>
              </button>
            ))}
          </div>

          <h2 className="mt-8 text-xl font-bold">Tosas que combinam com a pelagem</h2>
          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Tosa">
            {breed.groomings.map((g) => (
              <button key={g} type="button" role="radio" aria-checked={grooming === g} className="chip aria-checked:bg-ink aria-checked:text-white" onClick={() => setGrooming(g)}>
                {getGrooming(g)?.short}
              </button>
            ))}
          </div>
          {breed.groomings.length <= 2 && (
            <p className="mt-3 flex gap-2 text-sm text-ink-2"><Info className="mt-0.5 size-4 shrink-0 text-star" aria-hidden />
              {breed.coat === 'short' ? 'Pelo curto não costuma ser tosado: banho, hidratação e tosa higiênica deixam ele impecável.' : 'Pelagem dupla não deve ser raspada — o subpelo protege do frio e do calor. A tosa só modela e acerta o contorno.'}
            </p>
          )}

          <button type="button" className="btn btn-primary mt-10 h-14 w-full text-base sm:w-auto sm:px-10" onClick={go} data-testid="try-model">
            <Sparkles className="size-5" aria-hidden /> Experimentar no provador
          </button>
        </div>
      </div>
    </div>
  );
}
