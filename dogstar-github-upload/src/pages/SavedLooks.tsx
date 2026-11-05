import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { HardDrive, Trash2, Pencil } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { useStudio } from '../hooks/useStudio';
import { useToast } from '../hooks/useToast';
import { clearAllLocalData, idbDel, idbGet, idbKeys } from '../utils/storage';
import type { SavedLook } from '../types';
import { asset } from '../utils/asset';

export default function SavedLooks() {
  useSeo('Meus looks', 'Looks salvos no provador virtual da DogStar, guardados apenas neste navegador.');
  const [looks, setLooks] = useState<(SavedLook & { thumbUrl: string })[] | null>(null);
  const { loadLook, endSession } = useStudio();
  const toast = useToast();
  const nav = useNavigate();

  useEffect(() => {
    let urls: string[] = [];
    (async () => {
      try {
        const keys = (await idbKeys()).filter((k) => String(k).startsWith('look-'));
        const items = (await Promise.all(keys.map((k) => idbGet<SavedLook>(String(k))))).filter(Boolean) as SavedLook[];
        items.sort((a, b) => b.createdAt - a.createdAt);
        const withUrls = items.map((l) => ({ ...l, thumbUrl: URL.createObjectURL(l.thumbnail) }));
        urls = withUrls.map((l) => l.thumbUrl);
        setLooks(withUrls);
      } catch {
        setLooks([]);
      }
    })();
    return () => urls.forEach((u) => URL.revokeObjectURL(u));
  }, []);

  const remove = async (id: string) => {
    await idbDel(id).catch(() => undefined);
    setLooks((ls) => ls?.filter((l) => l.id !== id) ?? null);
  };

  const clearAll = async () => {
    if (!window.confirm('Apagar todos os looks, a foto e o rascunho guardados neste navegador?')) return;
    await clearAllLocalData();
    await endSession();
    setLooks([]);
    toast('Dados locais apagados.');
  };

  return (
    <div className="container-x py-10 lg:py-14">
      <h1 className="text-[clamp(2.4rem,5vw,3.8rem)] font-extrabold">Meus looks</h1>
      <p className="mt-3 flex max-w-2xl gap-2 text-ink-2">
        <HardDrive className="mt-1 size-5 shrink-0 text-star" aria-hidden />
        Seus looks ficam guardados só neste navegador, neste aparelho. Em outro celular ou navegador eles não aparecem — baixe a imagem para guardar de vez.
      </p>
      {looks === null ? (
        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">{[0, 1, 2, 3].map((i) => <div key={i} className="skeleton aspect-square rounded-[var(--radius-tile)]" />)}</div>
      ) : looks.length === 0 ? (
        <div className="mt-14 flex flex-col items-center text-center">
          <img src={asset('/images/dogs/bulldog-frances/fulvo/natural.svg')} alt="" className="size-40" />
          <p className="mt-4 text-xl font-semibold">Nenhum look salvo ainda.</p>
          <p className="mt-1 text-ink-2">No provador, toque em “Salvar look” para guardar uma composição aqui.</p>
          <Link to="/comecar" className="btn btn-primary mt-6">Criar um look</Link>
        </div>
      ) : (
        <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
          {looks.map((l) => (
            <li key={l.id} className="tile">
              <div className="tile-media"><img src={l.thumbUrl} alt={l.title} className="size-full object-cover" /></div>
              <p className="mt-3 font-bold">{l.title}</p>
              <p className="text-xs text-muted">{new Date(l.createdAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</p>
              <div className="mt-2 flex gap-2">
                <button type="button" className="btn btn-dark btn-sm" onClick={async () => { await loadLook(l); nav('/provador'); }}><Pencil className="size-4" aria-hidden /> Editar</button>
                <button type="button" className="btn btn-soft btn-icon min-h-10 w-10" aria-label={`Apagar ${l.title}`} onClick={() => remove(l.id)}><Trash2 className="size-4" /></button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="mt-16 border-t border-line pt-8">
        <button type="button" className="btn btn-ghost text-danger" onClick={clearAll} data-testid="clear-data"><Trash2 className="size-4" aria-hidden /> Limpar dados locais</button>
        <p className="mt-2 text-sm text-muted">Apaga looks salvos, a foto enviada e o rascunho do provador deste navegador.</p>
      </div>
    </div>
  );
}
