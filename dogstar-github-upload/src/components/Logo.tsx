import { asset } from '../utils/asset';

/** Original DogStar artwork, only background removed and resized. */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <picture className="contents">
      <source srcSet={asset('/images/logo/dogstar-wordmark.avif')} type="image/avif" />
      <source srcSet={asset('/images/logo/dogstar-wordmark.webp')} type="image/webp" />
      <img src={asset('/images/logo/dogstar-wordmark.png')} alt="DogStar" width={360} height={78} className={className} />
    </picture>
  );
}

export function FullLogo({ className = '', sticker = false, eager = false }: { className?: string; sticker?: boolean; eager?: boolean }) {
  const name = sticker ? 'dogstar-logo-sticker' : 'dogstar-logo';
  return (
    <picture className="contents">
      <source srcSet={asset(`/images/logo/${name}.avif`)} type="image/avif" />
      <source srcSet={asset(`/images/logo/${name}.webp`)} type="image/webp" />
      <img
        src={asset(`/images/logo/${name}.png`)}
        alt="DogStar Banho e Tosa"
        width={520}
        height={sticker ? 682 : 618}
        loading={eager ? 'eager' : 'lazy'}
        className={className}
      />
    </picture>
  );
}

export function Emblem({ className = '' }: { className?: string }) {
  return (
    <picture className="contents">
      <source srcSet={asset('/images/logo/dogstar-emblem.avif')} type="image/avif" />
      <source srcSet={asset('/images/logo/dogstar-emblem.webp')} type="image/webp" />
      <img src={asset('/images/logo/dogstar-emblem.png')} alt="" width={256} height={269} className={className} />
    </picture>
  );
}
