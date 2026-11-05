import { Link, useNavigate } from 'react-router-dom';
import { Camera, PawPrint, RotateCcw } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { useStudio } from '../hooks/useStudio';
import { getBreed, getModel } from '../data';
import { asset } from '../utils/asset';

export default function Start() {
  useSeo('Comece pelo seu cachorro', 'Escolha um modelo de raça ou envie a foto do seu pet para experimentar tosas, roupas e acessórios.');
  const { subject, pending, doc } = useStudio();
  const nav = useNavigate();
  const current = subject?.kind === 'model' ? getModel(subject.modelId) : null;
  return (
    <div className="container-x py-12 lg:py-20">
      <h1 className="max-w-3xl text-[clamp(2.4rem,6vw,4.4rem)] font-extrabold">Como você quer experimentar novos estilos para seu pet?</h1>
      {pending.length > 0 && (
        <p className="mt-4 badge text-sm">{pending.map((p) => p.name).join(', ')} vai entrar no provador assim que você escolher o cachorro.</p>
      )}
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <Link to="/racas" className="group relative overflow-hidden rounded-[var(--radius-stage)] bg-paper p-8 transition-shadow hover:shadow-[var(--shadow-lift)]">
          <div className="flex -space-x-10" aria-hidden>
            {['golden-retriever/dourado', 'shih-tzu/branco-caramelo', 'bulldog-frances/fulvo', 'husky-siberiano/cinza-branco'].map((p, i) => (
              <img key={p} src={asset(`/images/dogs/${p}/natural.svg`)} alt="" className="size-32 transition-transform duration-500 group-hover:-translate-y-1 sm:size-40" style={{ transitionDelay: `${i * 40}ms` }} />
            ))}
          </div>
          <h2 className="mt-6 flex items-center gap-3 text-3xl font-extrabold"><PawPrint className="size-7 text-star" aria-hidden /> Escolher um cachorro</h2>
          <p className="mt-2 max-w-md text-ink-2">Galeria com raças de todos os portes e vira-latas, em várias cores. Cada modelo já vem com as tosas compatíveis prontas.</p>
        </Link>
        <Link to="/enviar-foto" className="group relative overflow-hidden rounded-[var(--radius-stage)] bg-ink p-8 text-white transition-shadow hover:shadow-[var(--shadow-pop)]">
          <div className="flex size-32 items-center justify-center rounded-[2rem] bg-white/10 sm:size-40" aria-hidden>
            <Camera className="size-14 text-star transition-transform duration-500 group-hover:scale-110" />
          </div>
          <h2 className="mt-6 flex items-center gap-3 text-3xl font-extrabold">Enviar foto do meu pet</h2>
          <p className="mt-2 max-w-md text-[#cfcfcf]">Use uma foto do seu cachorro para provar roupas e acessórios. A foto é processada só no seu aparelho.</p>
        </Link>
      </div>
      {subject && (
        <div className="mt-8 flex flex-wrap items-center gap-4 rounded-3xl bg-star-50 p-5">
          <p className="flex-1 text-ink-2">
            Você tem um look em andamento{current ? ` com ${getBreed(current.breed)?.name}` : ' com a sua foto'}
            {doc.layers.length ? ` e ${doc.layers.length} ${doc.layers.length === 1 ? 'item' : 'itens'}` : ''}.
          </p>
          <button type="button" className="btn btn-dark btn-sm" onClick={() => nav('/provador')}>
            <RotateCcw className="size-4" aria-hidden /> Continuar de onde parei
          </button>
        </div>
      )}
    </div>
  );
}
