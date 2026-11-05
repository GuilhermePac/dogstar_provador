import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { useStudio } from '../hooks/useStudio';
import { BeforeAfter } from '../components/BeforeAfter';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { BREEDS, getBreed, getModel, groomingsFor, modelsOf } from '../data';
import { MESSAGES } from '../config';
import type { GroomingStyle } from '../types';

export default function Grooming() {
  useSeo('Galeria de tosas', 'Tosa bebê, ursinho, na tesoura, na máquina, higiênica, asiática, verão e mais — veja o antes e depois e as raças compatíveis.');
  const { subject } = useStudio();
  const currentBreed = subject?.kind === 'model' ? getModel(subject.modelId)?.breed : undefined;
  const [breed, setBreed] = useState(currentBreed ?? '');
  const { compatible, other } = useMemo(() => groomingsFor(breed || undefined), [breed]);
  const styles = compatible.filter((g) => g.id !== 'natural');

  return (
    <div className="container-x py-10 lg:py-14">
      <h1 className="text-[clamp(2.4rem,5vw,3.8rem)] font-extrabold">Galeria de tosas</h1>
      <p className="mt-3 max-w-2xl text-lg text-ink-2">
        Arraste para comparar a pelagem natural com cada estilo. As imagens são ilustrações de referência preparadas para cada raça — a tosa real depende da pelagem do seu pet.
      </p>
      <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:items-center">
        <label htmlFor="breed" className="font-semibold">Mostrar primeiro as tosas para</label>
        <select id="breed" value={breed} onChange={(e) => setBreed(e.target.value)} className="field sm:w-72">
          <option value="">todas as raças</option>
          {BREEDS.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
        </select>
      </div>

      <ul className="mt-10 grid gap-x-6 gap-y-14 md:grid-cols-2 xl:grid-cols-3">
        {styles.map((g) => <GroomCard key={g.id} g={g} breed={breed} />)}
      </ul>

      {breed && other.length > 0 && (
        <section className="mt-16 border-t border-line pt-10">
          <h2 className="text-2xl font-bold">Não indicadas para a pelagem de {getBreed(breed)?.name}</h2>
          <p className="mt-2 text-ink-2">{other.map((g) => g.name).join(', ')}.</p>
        </section>
      )}
    </div>
  );
}

function GroomCard({ g, breed }: { g: GroomingStyle; breed: string }) {
  const { startWithModel } = useStudio();
  const nav = useNavigate();
  // show the chosen breed's own illustration when available
  const model = breed ? modelsOf(breed)[0] : getModel(g.referenceModel);
  const before = model?.images.natural ?? g.referenceBefore;
  const after = model?.images[g.id] ?? g.reference;
  const names = g.breeds.map((s) => getBreed(s)?.name.split(' (')[0]).filter(Boolean);
  return (
    <li data-testid={`grooming-${g.id}`}>
      <BeforeAfter before={before} after={after} afterLabel={g.short} alt={`${g.name}, ${model ? getBreed(model.breed)?.name : ''}`} />
      <h2 className="mt-5 text-2xl font-extrabold">{g.name}</h2>
      <p className="mt-2 text-ink-2">{g.description}</p>
      <p className="mt-3 text-sm text-muted"><span className="font-semibold text-ink-2">Pelagens:</span> {g.coats.join(', ')}</p>
      <p className="mt-1 line-clamp-2 text-sm text-muted"><span className="font-semibold text-ink-2">Raças:</span> {names.join(', ')}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        {model && model.images[g.id] ? (
          <button type="button" className="btn btn-primary btn-sm" onClick={() => { startWithModel(model.id, g.id); nav('/provador'); }}>
            <Sparkles className="size-4" aria-hidden /> Experimentar
          </button>
        ) : (
          <Link to={`/racas?tosa=${g.id}`} className="btn btn-primary btn-sm"><Sparkles className="size-4" aria-hidden /> Escolher raça</Link>
        )}
        <WhatsAppButton text={`${MESSAGES.grooming}\n\nEstilo: ${g.name}`} label="Perguntar" variant="ghost" className="btn-sm" />
      </div>
    </li>
  );
}
