import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bookmark, Copy, Download, Loader2, MessageCircle, Share2, Sparkles, Wand2 } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { useStudio } from '../hooks/useStudio';
import { useToast } from '../hooks/useToast';
import { composeImage, downloadBlob } from '../canvas/compose';
import { copyText, shareImage } from '../utils/share';
import { lookMessage, whatsappLink, hasBusinessNumber } from '../utils/whatsapp';
import { getBreed, getGrooming, getModel } from '../data';
import { idbSet } from '../utils/storage';
import type { SavedLook } from '../types';

export default function Result() {
  useSeo('Seu resultado', 'Baixe e compartilhe o visual criado no provador virtual da DogStar.');
  const { subject, doc, photoUrl, photoBlob, ready } = useStudio();
  const [blob, setBlob] = useState<Blob | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [petName, setPetName] = useState('');
  const [shareFallback, setShareFallback] = useState(false);
  const toast = useToast();
  const nav = useNavigate();

  const model = subject?.kind === 'model' ? getModel(subject.modelId) : undefined;
  const breed = model ? getBreed(model.breed) : undefined;
  const base = model ? model.images[doc.grooming] ?? model.images.natural : photoUrl;
  const original = model ? model.images.natural : photoUrl;
  const grooming = getGrooming(doc.grooming);
  const label = model ? 'Ilustração de referência com montagem' : 'Foto original com montagem de acessórios';

  useEffect(() => {
    if (!base) return;
    let alive = true;
    let objectUrl: string | null = null;
    composeImage({ base, layers: doc.layers, backdrop: model ? doc.backdrop : null, label })
      .then((b) => {
        if (!alive) return;
        objectUrl = URL.createObjectURL(b);
        setBlob(b);
        setUrl(objectUrl);
      })
      .catch(() => alive && setError('Não foi possível montar a imagem. Volte ao provador e tente de novo.'));
    return () => { alive = false; if (objectUrl) URL.revokeObjectURL(objectUrl); };
  }, [base, doc, model, label]);

  const summary = useMemo(() => ({
    petName: petName.trim() || undefined,
    breed: breed?.name,
    model: model?.name,
    grooming: grooming?.name,
    groomingIsReference: subject?.kind === 'photo' && doc.grooming !== 'natural',
    clothes: doc.layers.filter((l) => l.kind === 'clothes').map((l) => `${l.name}${l.colorName ? ` (${l.colorName})` : ''}`),
    accessories: doc.layers.filter((l) => l.kind === 'accessory').map((l) => l.name),
  }), [petName, breed, model, grooming, subject, doc]);
  const message = lookMessage(summary);
  const filename = `dogstar-${(petName.trim() || breed?.slug || 'meu-pet').toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`;

  if (ready && (!subject || !base)) {
    return (
      <div className="container-x py-16 text-center">
        <h1 className="text-4xl font-extrabold">Nenhum look em andamento</h1>
        <p className="mt-3 text-ink-2">Monte um visual no provador para ver o resultado aqui.</p>
        <Link to="/comecar" className="btn btn-primary mt-8">Abrir provador</Link>
      </div>
    );
  }

  const share = async () => {
    if (!blob) return;
    const r = await shareImage(blob, filename, message);
    if (r === 'unsupported') setShareFallback(true);
  };

  const save = async () => {
    if (!blob || !subject) return;
    try {
      const look: SavedLook = {
        id: `look-${Date.now()}`, createdAt: Date.now(),
        title: petName.trim() || (model ? `${breed?.name}, ${model.name}` : 'Meu pet'),
        subject, doc, thumbnail: blob, photo: subject.kind === 'photo' ? photoBlob ?? undefined : undefined,
      };
      await idbSet(look.id, look);
      toast('Look salvo em Meus looks, neste aparelho.');
    } catch {
      toast('Não foi possível salvar neste navegador. Baixe a imagem para guardar.', 'error');
    }
  };

  return (
    <div className="container-x py-10 lg:py-14">
      <h1 className="text-[clamp(2.4rem,6vw,4.4rem)] font-extrabold">Olha como ficou esse estiloso!</h1>
      <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_1fr]">
        <div>
          <div className="overflow-hidden rounded-[var(--radius-stage)] bg-paper shadow-[var(--shadow-lift)]">
            {url ? (
              <img src={url} alt={`Resultado: ${label}`} className="animate-pop w-full" data-testid="result-image" />
            ) : error ? (
              <p role="alert" className="p-10 text-danger">{error}</p>
            ) : (
              <div className="skeleton flex aspect-[1/1.1] w-full items-center justify-center"><Loader2 className="size-8 animate-spin text-muted" aria-hidden /></div>
            )}
          </div>
          <div className="mt-6 flex items-center gap-4">
            {original && <img src={original} alt={model ? 'Ilustração original sem montagem' : 'Sua foto original'} className="size-24 rounded-2xl bg-paper object-contain" />}
            <p className="text-sm text-ink-2"><strong className="block text-ink">{model ? 'Original' : 'Foto original'}</strong>{label}. A imagem foi composta no seu aparelho.</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold">O que tem nesse look</h2>
          <dl className="mt-4 divide-y divide-line rounded-3xl bg-paper px-5">
            {breed && <Row k="Modelo" v={`${breed.name}, ${model?.name}`} />}
            <Row k="Tosa" v={`${grooming?.name ?? 'Pelagem natural'}${summary.groomingIsReference ? ' (referência)' : ''}`} />
            <Row k="Roupa" v={summary.clothes.join(', ') || 'Nenhuma'} />
            <Row k="Acessórios" v={summary.accessories.join(', ') || 'Nenhum'} />
          </dl>

          <label htmlFor="pet" className="mt-6 block font-semibold">Nome do pet <span className="font-normal text-muted">(opcional, vai na mensagem)</span></label>
          <input id="pet" value={petName} onChange={(e) => setPetName(e.target.value)} maxLength={40} className="field mt-2" placeholder="Ex.: Paçoca" autoComplete="off" />

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <button type="button" className="btn btn-primary h-14" disabled={!blob} onClick={() => blob && downloadBlob(blob, filename)} data-testid="download">
              <Download className="size-5" aria-hidden /> Baixar imagem
            </button>
            <button type="button" className="btn btn-dark h-14" disabled={!blob} onClick={share} data-testid="share">
              <Share2 className="size-5" aria-hidden /> Compartilhar
            </button>
            <button type="button" className="btn btn-ghost h-14" onClick={() => nav('/provador')}>
              <Wand2 className="size-5" aria-hidden /> Experimentar outro estilo
            </button>
            <a href={whatsappLink(message)} target="_blank" rel="noopener noreferrer" className="btn btn-ghost h-14" data-testid="talk-dogstar">
              <MessageCircle className="size-5" aria-hidden /> Falar com a DogStar
            </a>
          </div>
          <button type="button" className="btn btn-soft mt-3 w-full" onClick={save} disabled={!blob} data-testid="save-result"><Bookmark className="size-4" aria-hidden /> Salvar em Meus looks</button>

          {shareFallback && (
            <div role="status" className="mt-5 rounded-3xl bg-star-50 p-5 text-sm" data-testid="share-fallback">
              <p className="font-semibold">Este navegador não compartilha imagens direto.</p>
              <p className="mt-1 text-ink-2">Baixe a imagem e anexe no WhatsApp, ou envie só a descrição do look:</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button type="button" className="btn btn-dark btn-sm" onClick={() => blob && downloadBlob(blob, filename)}><Download className="size-4" aria-hidden /> Baixar</button>
                <a className="btn btn-ghost btn-sm" href={whatsappLink(message, '')} target="_blank" rel="noopener noreferrer"><MessageCircle className="size-4" aria-hidden /> Enviar descrição</a>
                <button type="button" className="btn btn-ghost btn-sm" onClick={async () => toast((await copyText(message)) ? 'Descrição copiada' : 'Não foi possível copiar', 'info')}><Copy className="size-4" aria-hidden /> Copiar texto</button>
              </div>
            </div>
          )}
          {!hasBusinessNumber() && (
            <p className="mt-4 text-xs text-muted">O WhatsApp vai abrir com a mensagem pronta para você escolher o contato da DogStar.</p>
          )}
          <p className="mt-6 flex gap-2 text-sm text-ink-2"><Sparkles className="mt-0.5 size-4 shrink-0 text-star" aria-hidden />Montagem ilustrativa. A tosa real depende da pelagem e do bem-estar de cada pet — a equipe da DogStar avalia com você.</p>
        </div>
      </div>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-4 py-3 text-sm">
      <dt className="w-24 shrink-0 text-muted">{k}</dt>
      <dd className="font-semibold">{v}</dd>
    </div>
  );
}
