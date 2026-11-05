import { Link } from 'react-router-dom';
import { Scissors, Shirt, Heart } from 'lucide-react';
import { useSeo } from '../hooks/useSeo';
import { FullLogo } from '../components/Logo';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { CONFIG, MESSAGES } from '../config';

export default function About() {
  useSeo('A DogStar', 'Conheça a DogStar Banho e Tosa, em São José dos Pinhais — PR: banho, tosa, roupas e acessórios para deixar seu pet uma estrela.');
  return (
    <div>
      <section className="container-x grid items-center gap-10 py-12 lg:grid-cols-[1fr_auto] lg:py-20">
        <div className="max-w-2xl">
          <h1 className="text-[clamp(2.6rem,6vw,4.6rem)] font-extrabold">Aqui todo pet é estrela</h1>
          <p className="mt-6 text-xl text-ink-2">
            A DogStar é banho e tosa em {CONFIG.city}. Cuidamos da pelagem, da higiene e do visual do seu cachorro com carinho — e o provador virtual nasceu para você chegar aqui sabendo exatamente o estilo que quer.
          </p>
          <WhatsAppButton text={MESSAGES.general} className="mt-8 h-14 px-8" label="Agendar pelo WhatsApp" />
        </div>
        <FullLogo className="mx-auto h-72 w-auto lg:h-96" eager />
      </section>
      <section className="bg-paper py-16">
        <div className="container-x grid gap-10 md:grid-cols-3">
          {[
            { icon: Scissors, t: 'Banho e tosa', d: 'Tosa bebê, ursinho, na tesoura, na máquina, higiênica e estilos de raça, respeitando o tipo de pelagem de cada pet.' },
            { icon: Shirt, t: 'Roupas e acessórios', d: 'Laços, bandanas, gravatinhas, roupinhas e mimos para completar o visual. Consulte a disponibilidade pelo WhatsApp.' },
            { icon: Heart, t: 'Bem-estar primeiro', d: 'Nem toda tosa combina com toda pelagem. Antes de qualquer corte, avaliamos o que é melhor para o conforto do seu cachorro.' },
          ].map(({ icon: Icon, t, d }) => (
            <div key={t}>
              <Icon className="size-8 text-star" aria-hidden />
              <h2 className="mt-4 text-2xl font-bold">{t}</h2>
              <p className="mt-2 text-ink-2">{d}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="container-x py-16">
        <h2 className="text-3xl font-extrabold sm:text-4xl">Sobre o provador virtual</h2>
        <div className="mt-6 grid max-w-4xl gap-6 text-ink-2 md:grid-cols-2">
          <p>Os modelos de raça são ilustrações criadas especialmente para a DogStar, com uma imagem pronta para cada estilo de tosa compatível com a pelagem. Roupas e acessórios são peças desenhadas para encaixar no provador.</p>
          <p>Não usamos inteligência artificial nem serviços pagos: tudo roda no seu navegador. Em fotos enviadas, dá para provar roupas e acessórios; as tosas aparecem como referência, sem fingir uma transformação que não aconteceu.</p>
        </div>
        <Link to="/comecar" className="btn btn-primary mt-10">Experimentar agora</Link>
      </section>
    </div>
  );
}
