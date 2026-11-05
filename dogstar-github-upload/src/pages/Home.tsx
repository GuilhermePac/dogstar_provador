import { Link } from 'react-router-dom';
import { Camera, PawPrint } from 'lucide-react';
import { HeroTryOn } from '../sections/HeroTryOn';
import { BeforeAfter } from '../components/BeforeAfter';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { FullLogo } from '../components/Logo';
import { useSeo } from '../hooks/useSeo';
import { MESSAGES } from '../config';
import { BREEDS, CLOTHES, ACCESSORIES, GROOMING } from '../data';
import { asset } from '../utils/asset';

export default function Home() {
  useSeo('DogStar Pet Style — Provador virtual de tosas, roupas e acessórios', 'Experimente tosas, roupinhas e acessórios no seu cachorro com o provador virtual da DogStar Banho e Tosa. Grátis, sem cadastro e sua foto não sai do seu celular.');
  return (
    <>
      {/* ---------- hero */}
      <section className="overflow-hidden">
        <div className="container-x grid items-center gap-10 pt-8 pb-16 lg:grid-cols-[1fr_1.05fr] lg:gap-6 lg:pt-14 lg:pb-24">
          <div className="max-w-xl">
            <h1 className="text-[clamp(2.9rem,7.4vw,5.6rem)] font-extrabold">
              Seu pet. Seu estilo. Sua criatividade!
            </h1>
            <p className="mt-6 max-w-[34rem] text-lg text-ink-2 sm:text-xl">
              Descubra novos visuais para seu melhor amigo. Experimente tosas, roupinhas e acessórios no nosso provador virtual.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/racas" className="btn btn-primary h-14 px-7 text-base">
                <PawPrint className="size-5" aria-hidden /> Escolher um modelo
              </Link>
              <Link to="/enviar-foto" className="btn btn-dark h-14 px-7 text-base">
                <Camera className="size-5" aria-hidden /> Enviar foto do meu pet
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted">Grátis, sem cadastro — e a foto do seu pet nunca sai do seu celular.</p>
          </div>
          <HeroTryOn />
        </div>
      </section>

      {/* ---------- categories */}
      <section aria-labelledby="cat-title" className="bg-paper py-20">
        <div className="container-x">
          <h2 id="cat-title" className="max-w-2xl text-4xl font-extrabold sm:text-5xl">Tudo o que dá para experimentar</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-[1.25fr_1fr] md:grid-rows-2">
            <Link to="/tosas" className="group relative flex min-h-[340px] flex-col justify-end overflow-hidden rounded-[var(--radius-stage)] bg-white p-7 md:row-span-2">
              <div className="absolute inset-x-0 top-0 grid grid-cols-3 gap-0 px-6 pt-6">
                {['natural', 'ursinho', 'asiatica'].map((g) => (
                  <img key={g} src={asset(`/images/dogs/poodle-toy/abricot/${g}.svg`)} alt="" className="w-full transition-transform duration-500 group-hover:-translate-y-1" loading="lazy" />
                ))}
              </div>
              <div className="relative bg-gradient-to-t from-white via-white to-white/0 pt-16">
                <h3 className="text-3xl font-extrabold">Tosas</h3>
                <p className="mt-2 max-w-sm text-ink-2">{GROOMING.length - 1} estilos, do bebê ao asiático, com referência para cada raça.</p>
              </div>
            </Link>
            <Link to="/roupas" className="group flex items-center gap-5 overflow-hidden rounded-[var(--radius-stage)] bg-white p-6">
              <img src={asset('/images/clothes/moletom-capuz-laranja.svg')} alt="" className="h-32 w-auto transition-transform duration-500 group-hover:rotate-[-4deg]" loading="lazy" />
              <div>
                <h3 className="text-3xl font-extrabold">Roupas</h3>
                <p className="mt-1 text-ink-2">{CLOTHES.length} peças: pijamas, moletons, fantasias e mais.</p>
              </div>
            </Link>
            <Link to="/acessorios" className="group flex items-center gap-5 overflow-hidden rounded-[var(--radius-stage)] bg-white p-6">
              <img src={asset('/images/accessories/oculos-escuros.svg')} alt="" className="h-20 w-auto transition-transform duration-500 group-hover:scale-110" loading="lazy" />
              <div>
                <h3 className="text-3xl font-extrabold">Acessórios</h3>
                <p className="mt-1 text-ink-2">{ACCESSORIES.length} itens: laços, óculos, chapéus, bandanas…</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- before / after */}
      <section aria-labelledby="ba-title" className="py-20">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <h2 id="ba-title" className="text-4xl font-extrabold sm:text-5xl">Antes e depois, lado a lado</h2>
            <p className="mt-4 max-w-md text-lg text-ink-2">
              Arraste a barra para comparar. Cada raça tem ilustrações prontas para os estilos de tosa que combinam com a pelagem dela.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <BeforeAfter before={asset('/images/dogs/schnauzer/sal-pimenta/natural.svg')} after={asset('/images/dogs/schnauzer/sal-pimenta/maquina.svg')} afterLabel="Máquina" alt="Schnauzer" />
              <BeforeAfter before={asset('/images/dogs/spitz-alemao/laranja/natural.svg')} after={asset('/images/dogs/spitz-alemao/laranja/ursinho.svg')} afterLabel="Ursinho" alt="Spitz Alemão" />
            </div>
          </div>
          <BeforeAfter before={asset('/images/dogs/poodle-toy/branco/natural.svg')} after={asset('/images/dogs/poodle-toy/branco/asiatica.svg')} afterLabel="Tosa asiática" alt="Poodle Toy branco" />
        </div>
        <p className="container-x mt-4 text-sm text-muted">Imagens ilustrativas de referência — não são transformações feitas em tempo real.</p>
      </section>

      {/* ---------- how it works (a real sequence) */}
      <section aria-labelledby="how-title" className="bg-paper py-20">
        <div className="container-x">
          <h2 id="how-title" className="text-4xl font-extrabold sm:text-5xl">Como funciona</h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-3">
            {[
              ['Escolha o cachorro', `Um dos ${BREEDS.length} modelos de raça ou uma foto do seu próprio pet.`],
              ['Vista e ajuste', 'Toque numa roupa ou acessório, arraste, aumente e gire até ficar no lugar certo.'],
              ['Salve e mostre pra gente', 'Baixe a imagem, compartilhe e mande para a DogStar pelo WhatsApp.'],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="font-display text-6xl leading-none font-extrabold text-star">{i + 1}</span>
                <div>
                  <h3 className="text-2xl font-bold">{t}</h3>
                  <p className="mt-2 text-ink-2">{d}</p>
                </div>
              </li>
            ))}
          </ol>
          <Link to="/comecar" className="btn btn-primary mt-12 h-14 px-8 text-base">Começar agora</Link>
        </div>
      </section>

      {/* ---------- commercial CTA */}
      <section aria-labelledby="cta-title" className="container-x pt-20">
        <div className="relative grid items-center gap-8 overflow-hidden rounded-[var(--radius-stage)] bg-ink px-6 py-12 text-white sm:px-12 md:grid-cols-[auto_1fr]">
          <FullLogo sticker className="mx-auto h-48 w-auto md:h-60" />
          <div>
            <h2 id="cta-title" className="text-4xl font-extrabold sm:text-5xl">Gostou do resultado?</h2>
            <p className="mt-4 max-w-xl text-xl text-[#d6d6d6]">Venha deixar seu pet ainda mais estiloso na DogStar!</p>
            <WhatsAppButton text={MESSAGES.grooming} className="mt-8 h-14 px-8 text-base" label="Conversar pelo WhatsApp" />
          </div>
        </div>
      </section>
    </>
  );
}
