import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';
import { asset } from '../utils/asset';

export default function NotFound() {
  useSeo('Página não encontrada', 'Essa página não existe no site da DogStar.');
  return (
    <div className="container-x flex flex-col items-center py-20 text-center">
      <img src={asset('/images/dogs/beagle/tricolor/natural.svg')} alt="" className="size-48" />
      <h1 className="mt-4 text-5xl font-extrabold">Essa página fugiu do banho</h1>
      <p className="mt-3 max-w-md text-lg text-ink-2">O endereço não existe ou mudou. Que tal voltar para o provador?</p>
      <div className="mt-8 flex gap-3">
        <Link to="/" className="btn btn-ghost">Início</Link>
        <Link to="/comecar" className="btn btn-primary">Abrir provador</Link>
      </div>
    </div>
  );
}
