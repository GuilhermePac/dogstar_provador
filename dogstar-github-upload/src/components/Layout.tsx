import { Suspense, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { Wordmark, FullLogo } from './Logo';
import { WhatsAppButton } from './WhatsAppButton';
import { CONFIG, MESSAGES } from '../config';

const NAV = [
  { to: '/racas', label: 'Raças' },
  { to: '/tosas', label: 'Tosas' },
  { to: '/roupas', label: 'Roupas' },
  { to: '/acessorios', label: 'Acessórios' },
  { to: '/sobre', label: 'A DogStar' },
];

export function Layout() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const studio = pathname.startsWith('/provador');

  useEffect(() => { setOpen(false); window.scrollTo({ top: 0 }); }, [pathname]);
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
  }, [open]);

  return (
    <div className="flex min-h-dvh flex-col">
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-white">
        Pular para o conteúdo
      </a>
      <header className="sticky top-0 z-40 border-b border-line/70 bg-white/90 backdrop-blur-md">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <Link to="/" aria-label="DogStar Pet Style — página inicial" className="shrink-0">
            <Wordmark className="h-7 w-auto sm:h-8" />
          </Link>
          <nav aria-label="Principal" className="hidden items-center gap-1 lg:flex">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => `rounded-full px-4 py-2 text-[0.95rem] font-medium transition-colors ${isActive ? 'bg-paper text-ink' : 'text-ink-2 hover:text-star-600'}`}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            {!studio && (
              <Link to="/comecar" className="btn btn-primary btn-sm hidden sm:inline-flex">
                <Sparkles className="size-4" aria-hidden /> Abrir provador
              </Link>
            )}
            <button type="button" className="btn btn-soft btn-icon lg:hidden" aria-label={open ? 'Fechar menu' : 'Abrir menu'} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>
        </div>
        {open && (
          <div className="animate-fade fixed inset-x-0 top-16 bottom-0 z-40 overflow-y-auto bg-white lg:hidden">
            <nav aria-label="Menu" className="container-x flex flex-col py-4">
              <Link to="/comecar" className="btn btn-primary mb-4 w-full">
                <Sparkles className="size-4" aria-hidden /> Abrir provador
              </Link>
              {[{ to: '/', label: 'Início' }, ...NAV, { to: '/meus-looks', label: 'Meus looks' }].map((n) => (
                <NavLink key={n.to} to={n.to} end className={({ isActive }) => `border-b border-line py-4 font-display text-2xl font-bold ${isActive ? 'text-star-600' : 'text-ink'}`}>
                  {n.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      <main id="conteudo" className="flex-1">
        <Suspense fallback={<PageSkeleton />}>
          <Outlet />
        </Suspense>
      </main>

      {!studio && <Footer />}
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="container-x py-12" aria-busy="true" aria-label="Carregando">
      <div className="skeleton h-10 w-2/3 rounded-xl" />
      <div className="skeleton mt-4 h-5 w-1/2 rounded-lg" />
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) => <div key={i} className="skeleton aspect-square rounded-[var(--radius-tile)]" />)}
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-24 bg-ink text-white">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.2fr_1fr_1fr]">
        <div className="flex items-start gap-5">
          <FullLogo sticker className="h-28 w-auto shrink-0" />
          <div>
            <p className="font-display text-2xl font-bold">DogStar Banho e Tosa</p>
            <p className="mt-2 max-w-xs text-sm text-[#bdbdbd]">{CONFIG.city}. O provador virtual é gratuito, não pede cadastro e sua foto não sai do seu aparelho.</p>
          </div>
        </div>
        <nav aria-label="Rodapé" className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
          {[['/comecar', 'Provador'], ['/racas', 'Raças'], ['/tosas', 'Tosas'], ['/roupas', 'Roupas'], ['/acessorios', 'Acessórios'], ['/meus-looks', 'Meus looks'], ['/sobre', 'A DogStar'], ['/privacidade', 'Privacidade']].map(([to, l]) => (
            <Link key={to} to={to} className="py-1 text-[#d6d6d6] hover:text-star">{l}</Link>
          ))}
        </nav>
        <div>
          <p className="font-display text-xl font-bold">Gostou de algum visual?</p>
          <p className="mt-1 text-sm text-[#bdbdbd]">Mande uma mensagem e a gente deixa seu pet assim de verdade.</p>
          <WhatsAppButton text={MESSAGES.general} className="mt-4" label="Falar com a DogStar" />
        </div>
      </div>
      <div className="border-t border-white/10">
        <p className="container-x py-5 text-xs text-[#9a9a9a]">
          Ilustrações e montagens são simulações visuais para inspirar — o resultado real da tosa depende da pelagem de cada pet.
        </p>
      </div>
    </footer>
  );
}
