import { Link } from 'react-router-dom';
import { useSeo } from '../hooks/useSeo';

export default function Privacy() {
  useSeo('Privacidade', 'Como o provador virtual da DogStar trata as fotos e os dados do visitante: tudo fica no seu aparelho.');
  return (
    <div className="container-x max-w-3xl py-12 lg:py-16">
      <h1 className="text-[clamp(2.4rem,5vw,3.6rem)] font-extrabold">Privacidade</h1>
      <div className="mt-8 space-y-6 text-lg text-ink-2 [&_h2]:mt-10 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-ink">
        <p>O provador virtual da DogStar foi feito para funcionar sem cadastro e sem enviar nada para servidores.</p>
        <h2>Fotos</h2>
        <p>A foto que você escolhe é aberta, recortada e combinada com os acessórios dentro do seu próprio navegador. Ela não é enviada para a DogStar, para servidores nem para serviços de terceiros. Ao processar a imagem, os metadados (como a localização GPS da foto) são descartados.</p>
        <h2>O que fica salvo no aparelho</h2>
        <p>Para você não perder o trabalho, o rascunho do provador, a última foto usada e os looks que você salvar ficam guardados no armazenamento local deste navegador (IndexedDB). Esses dados não saem do aparelho e não aparecem em outros navegadores ou celulares.</p>
        <p>Você pode apagar tudo a qualquer momento em <Link to="/meus-looks" className="font-semibold text-star-600 underline">Meus looks › Limpar dados locais</Link>, ou limpando os dados do site nas configurações do navegador.</p>
        <h2>WhatsApp e compartilhamento</h2>
        <p>Quando você toca em “Falar com a DogStar” ou “Compartilhar”, é você quem decide o que enviar. A mensagem e a imagem só saem do aparelho pelo aplicativo que você escolher.</p>
        <h2>Cookies e rastreamento</h2>
        <p>Este site não usa cookies de rastreamento nem ferramentas de análise.</p>
      </div>
    </div>
  );
}
