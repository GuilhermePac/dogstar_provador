// Accessories (transparent background). `fit` tells the editor where the item
// goes: anchor point on the dog, which anchor width to size from, a multiplier,
// and pivotY = where along the item's height the anchor point should land.
import { shade } from './geometry.mjs';

const INK = '#1b1b1b';
const ST = `stroke="${INK}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"`;
const svg = (w, h, inner, defs = '') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><defs>${defs}</defs>${inner}</svg>`;

const star = (cx, cy, r, fill, extra = '') => {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${fill}" ${extra}/>`;
};

const bandana = (fillDef, defs = '') => svg(320, 230, `<path d="M 14 34 Q 160 70 306 34 L 160 218 Z" fill="${fillDef}" ${ST}/><path d="M 10 30 Q 160 70 310 30" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M 10 30 Q 160 70 310 30" fill="none" stroke="${fillDef.startsWith('url') ? '#c33' : shade(fillDef, -0.15)}" stroke-width="11" stroke-linecap="round"/>`, defs);

const bow = (c, dots = false) => svg(220, 140, `
  <path d="M 110 70 L 20 18 Q 0 70 20 122 Z" fill="${c}" ${ST}/>
  <path d="M 110 70 L 200 18 Q 220 70 200 122 Z" fill="${c}" ${ST}/>
  ${dots ? [[45, 50], [60, 90], [165, 50], [150, 92], [35, 80], [180, 78]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#fff"/>`).join('') : ''}
  <path d="M 30 40 Q 60 70 30 100 M 190 40 Q 160 70 190 100" fill="none" stroke="#000" stroke-width="4" opacity=".18"/>
  <rect x="92" y="46" width="36" height="48" rx="12" fill="${shade(c, -0.18)}" ${ST}/>`);

export const ACCESSORIES = [
  // bandanas
  {
    id: 'bandana-laranja-estrelas', name: 'Bandana Estrelas', category: 'bandanas', description: 'Laranja DogStar com estrelinhas brancas.',
    fit: { anchor: 'neck', widthFrom: 'neck', widthMul: 1.05, pivotY: 0.14 },
    draw: () => {
      const s = [[100, 70], [160, 100], [220, 70], [130, 130], [190, 140], [160, 175]].map(([x, y]) => star(x, y, 11, '#fff')).join('');
      return svg(320, 230, `<path d="M 14 34 Q 160 70 306 34 L 160 218 Z" fill="#ff7900" ${ST}/>${s}<path d="M 10 30 Q 160 70 310 30" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M 10 30 Q 160 70 310 30" fill="none" stroke="#e86d00" stroke-width="11" stroke-linecap="round"/>`);
    },
  },
  {
    id: 'bandana-xadrez', name: 'Bandana Xadrez', category: 'bandanas', description: 'Xadrez vermelho clássico.',
    fit: { anchor: 'neck', widthFrom: 'neck', widthMul: 1.05, pivotY: 0.14 },
    draw: () => bandana('url(#p)', `<pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#cf3a3a"/><rect width="40" height="14" y="13" fill="#000" opacity=".25"/><rect width="14" height="40" x="13" fill="#000" opacity=".25"/><rect width="40" height="3" y="34" fill="#fff" opacity=".55"/></pattern>`),
  },
  {
    id: 'bandana-jeans', name: 'Bandana Jeans', category: 'bandanas', description: 'Jeans com pesponto aparente.',
    fit: { anchor: 'neck', widthFrom: 'neck', widthMul: 1.05, pivotY: 0.14 },
    draw: () => svg(320, 230, `<path d="M 14 34 Q 160 70 306 34 L 160 218 Z" fill="#4f74a8" ${ST}/><path d="M 40 52 L 160 196 L 280 52" fill="none" stroke="#f2c36b" stroke-width="3" stroke-dasharray="8 6"/><path d="M 10 30 Q 160 70 310 30" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M 10 30 Q 160 70 310 30" fill="none" stroke="#3d5f8f" stroke-width="11" stroke-linecap="round"/>`),
  },
  // laços
  { id: 'laco-rosa', name: 'Laço Rosa', category: 'lacos', description: 'Laço de cetim para o topo da cabeça.', fit: { anchor: 'head', widthFrom: 'head', widthMul: 0.42, pivotY: 0.62 }, draw: () => bow('#f27ea9') },
  { id: 'laco-poa', name: 'Laço Poá', category: 'lacos', description: 'Vermelho com bolinhas brancas.', fit: { anchor: 'earR', widthFrom: 'head', widthMul: 0.36, pivotY: 0.5 }, draw: () => bow('#d63b45', true) },
  { id: 'laco-laranja', name: 'Laço DogStar', category: 'lacos', description: 'Laço laranja assinatura da casa.', fit: { anchor: 'earL', widthFrom: 'head', widthMul: 0.36, pivotY: 0.5 }, draw: () => bow('#ff7900') },
  // gravatas
  {
    id: 'gravata-borboleta', name: 'Gravata-Borboleta', category: 'gravatas', description: 'Preta, para ocasiões especiais.',
    fit: { anchor: 'neck', widthFrom: 'neck', widthMul: 0.5, pivotY: 0.3 },
    draw: () => svg(220, 120, `<path d="M 110 60 L 16 14 Q 4 60 16 106 Z" fill="#222" ${ST}/><path d="M 110 60 L 204 14 Q 216 60 204 106 Z" fill="#222" ${ST}/><rect x="94" y="40" width="32" height="40" rx="10" fill="#3a3a3a" ${ST}/><path d="M 30 36 Q 50 60 30 84" fill="none" stroke="#fff" stroke-width="4" opacity=".25"/>`),
  },
  {
    id: 'gravata-social', name: 'Gravata Social', category: 'gravatas', description: 'Gravata listrada estilo escritório.',
    fit: { anchor: 'neck', widthFrom: 'neck', widthMul: 0.3, pivotY: 0.06 },
    draw: () => svg(120, 330, `<path d="M 36 8 L 84 8 L 74 52 L 46 52 Z" fill="#1f3a68" ${ST}/><path d="M 46 52 L 74 52 L 100 270 L 60 322 L 20 270 Z" fill="#1f3a68" ${ST}/><g clip-path="url(#c)">${[60, 110, 160, 210, 260].map((y) => `<path d="M 0 ${y} L 120 ${y - 40}" stroke="#ff7900" stroke-width="10"/>`).join('')}</g>`, `<clipPath id="c"><path d="M 46 52 L 74 52 L 100 270 L 60 322 L 20 270 Z"/></clipPath>`),
  },
  // óculos
  {
    id: 'oculos-escuros', name: 'Óculos Escuros', category: 'oculos', description: 'Lentes escuras com aro grosso — atitude de estrela.',
    fit: { anchor: 'eyes', widthFrom: 'eyes', widthMul: 2.1, pivotY: 0.5 },
    draw: () => svg(420, 150, `<path d="M 30 40 Q 110 26 190 40 Q 196 120 120 126 Q 34 124 30 40 Z" fill="#141414" ${ST}/><path d="M 230 40 Q 310 26 390 40 Q 386 124 300 126 Q 224 120 230 40 Z" fill="#141414" ${ST}/><path d="M 186 48 Q 210 34 234 48" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/><path d="M 60 56 L 96 52 M 260 56 L 296 52" stroke="#fff" stroke-width="8" stroke-linecap="round" opacity=".55"/>`),
  },
  {
    id: 'oculos-coracao', name: 'Óculos Coração', category: 'oculos', description: 'Armação rosa em formato de coração.',
    fit: { anchor: 'eyes', widthFrom: 'eyes', widthMul: 2.1, pivotY: 0.45 },
    draw: () => {
      const heart = (x) => `<path d="M ${x} 128 C ${x - 90} 76 ${x - 70} 6 ${x} 44 C ${x + 70} 6 ${x + 90} 76 ${x} 128 Z" fill="#ff5c93" ${ST}/><path d="M ${x} 112 C ${x - 62} 74 ${x - 50} 30 ${x} 60 C ${x + 50} 30 ${x + 62} 74 ${x} 112 Z" fill="#ffd1e1" opacity=".85"/>`;
      return svg(420, 150, `${heart(110)}${heart(310)}<path d="M 172 58 Q 210 44 248 58" fill="none" stroke="${INK}" stroke-width="10" stroke-linecap="round"/>`);
    },
  },
  {
    id: 'oculos-redondo', name: 'Óculos Intelectual', category: 'oculos', description: 'Aro redondo dourado com lente transparente.',
    fit: { anchor: 'eyes', widthFrom: 'eyes', widthMul: 2.15, pivotY: 0.5 },
    draw: () => svg(420, 150, `<circle cx="112" cy="75" r="62" fill="#dff1ff" fill-opacity=".35" stroke="#b8902f" stroke-width="12"/><circle cx="308" cy="75" r="62" fill="#dff1ff" fill-opacity=".35" stroke="#b8902f" stroke-width="12"/><path d="M 174 70 Q 210 52 246 70" fill="none" stroke="#b8902f" stroke-width="10" stroke-linecap="round"/><path d="M 80 52 L 100 40" stroke="#fff" stroke-width="7" stroke-linecap="round"/>`),
  },
  // chapéus
  {
    id: 'chapeu-aniversario', name: 'Chapéu de Aniversário', category: 'chapeus', description: 'Cone de festa com pompom.',
    fit: { anchor: 'head', widthFrom: 'head', widthMul: 0.5, pivotY: 0.93 },
    draw: () => svg(200, 260, `<path d="M 100 30 L 186 240 Q 100 262 14 240 Z" fill="#ff7900" ${ST}/><path d="M 62 130 L 140 130 M 44 180 L 158 180" stroke="#fff" stroke-width="12"/><circle cx="100" cy="28" r="22" fill="#ffd23d" ${ST}/>`),
  },
  {
    id: 'chapeu-fedora', name: 'Chapéu Fedora', category: 'chapeus', description: 'Feltro cinza com fita preta.',
    fit: { anchor: 'head', widthFrom: 'head', widthMul: 1.0, pivotY: 0.84 },
    draw: () => svg(360, 190, `<path d="M 80 150 Q 80 40 130 30 Q 180 50 230 30 Q 280 40 280 150 Z" fill="#6c6f75" ${ST}/><rect x="80" y="112" width="200" height="34" fill="#1f1f1f"/><path d="M 10 156 Q 180 120 350 156 Q 180 192 10 156 Z" fill="#5a5d63" ${ST}/>`),
  },
  {
    id: 'chapeu-palha', name: 'Chapéu de Palha', category: 'chapeus', description: 'Para dias de sol, com fita laranja.',
    fit: { anchor: 'head', widthFrom: 'head', widthMul: 1.15, pivotY: 0.78 },
    draw: () => svg(380, 200, `<path d="M 10 150 Q 190 96 370 150 Q 190 206 10 150 Z" fill="#e8c77a" ${ST}/><path d="M 100 140 Q 96 50 190 44 Q 284 50 280 140 Q 190 158 100 140 Z" fill="#efd28b" ${ST}/><path d="M 102 118 Q 190 136 278 118 L 280 140 Q 190 158 100 140 Z" fill="#ff7900"/>${[60, 120, 260, 320].map((x) => `<path d="M ${x} 140 l 10 12" stroke="#b8933c" stroke-width="4"/>`).join('')}`),
  },
  {
    id: 'gorro-natal', name: 'Gorro de Natal', category: 'chapeus', description: 'Vermelho com barra e pompom brancos.',
    fit: { anchor: 'head', widthFrom: 'head', widthMul: 0.95, pivotY: 0.82 },
    draw: () => svg(320, 260, `<path d="M 40 200 Q 60 60 170 40 Q 280 40 300 130 L 270 200 Z" fill="#d12f3a" ${ST}/><circle cx="296" cy="130" r="28" fill="#fff" ${ST}/><rect x="24" y="186" width="268" height="54" rx="27" fill="#fff" ${ST}/>`),
  },
  {
    id: 'coroa', name: 'Coroa Real', category: 'chapeus', description: 'Dourada com pedras — para o rei ou a rainha da casa.',
    fit: { anchor: 'head', widthFrom: 'head', widthMul: 0.62, pivotY: 0.9 },
    draw: () => svg(260, 170, `<path d="M 20 150 L 20 40 L 76 90 L 130 20 L 184 90 L 240 40 L 240 150 Z" fill="#f4c430" ${ST}/><rect x="20" y="124" width="220" height="30" fill="#e0a91c" ${ST}/>${[[70, 139, '#d63b45'], [130, 139, '#2c56c9'], [190, 139, '#2f8f6a']].map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="9" fill="${c}"/>`).join('')}`),
  },
  // bonés
  {
    id: 'bone-laranja', name: 'Boné DogStar', category: 'bones', description: 'Boné laranja com aba curva.',
    fit: { anchor: 'head', widthFrom: 'head', widthMul: 0.92, pivotY: 0.72 },
    draw: () => svg(320, 210, `<path d="M 50 150 Q 46 30 160 26 Q 274 30 270 150 Z" fill="#ff7900" ${ST}/><path d="M 160 26 L 160 150" stroke="#e06a00" stroke-width="5"/><circle cx="160" cy="26" r="10" fill="#e06a00" ${ST}/><path d="M 20 160 Q 160 116 300 160 Q 300 196 160 186 Q 20 196 20 160 Z" fill="#1f1f1f" ${ST}/>${star(118, 96, 18, '#fff')}`),
  },
  {
    id: 'bone-preto', name: 'Boné Street', category: 'bones', description: 'Preto com aba reta e detalhe laranja.',
    fit: { anchor: 'head', widthFrom: 'head', widthMul: 0.92, pivotY: 0.72 },
    draw: () => svg(320, 210, `<path d="M 50 150 Q 46 30 160 26 Q 274 30 270 150 Z" fill="#232323" ${ST}/><path d="M 160 26 L 160 150" stroke="#3a3a3a" stroke-width="5"/><path d="M 14 168 L 306 168 L 300 186 L 20 186 Z" fill="#ff7900" ${ST}/>`),
  },
  // coleiras
  {
    id: 'coleira-estrela', name: 'Coleira com Pingente', category: 'coleiras', description: 'Couro caramelo com pingente de estrela.',
    fit: { anchor: 'neck', widthFrom: 'neck', widthMul: 1.0, pivotY: 0.3 },
    draw: () => svg(320, 120, `<path d="M 10 22 Q 160 64 310 22 L 310 46 Q 160 88 10 46 Z" fill="#a8652e" ${ST}/>${[50, 110, 210, 270].map((x) => `<circle cx="${x}" cy="${x < 160 ? 44 + (x - 50) * 0.12 : 44 + (270 - x) * 0.12}" r="5" fill="#e3c06a"/>`).join('')}<circle cx="160" cy="70" r="8" fill="none" stroke="#c9a23f" stroke-width="5"/>${star(160, 96, 22, '#f4c430', `stroke="${INK}" stroke-width="4"`)}`),
  },
  {
    id: 'coleira-spike', name: 'Coleira Rocker', category: 'coleiras', description: 'Preta com cravos arredondados.',
    fit: { anchor: 'neck', widthFrom: 'neck', widthMul: 1.0, pivotY: 0.5 },
    draw: () => svg(320, 100, `<path d="M 10 30 Q 160 72 310 30 L 310 58 Q 160 100 10 58 Z" fill="#1c1c1c" ${ST}/>${[40, 85, 130, 175, 220, 265].map((x, i) => { const y = 54 + Math.sin((x / 320) * Math.PI) * 18; return `<circle cx="${x + 8}" cy="${y.toFixed(1)}" r="8" fill="#d6d6d6" stroke="${INK}" stroke-width="3"/>`; }).join('')}`),
  },
  // peitorais
  {
    id: 'peitoral-laranja', name: 'Peitoral Aventura', category: 'peitorais', description: 'Acolchoado com faixa refletiva.',
    fit: { anchor: 'chest', widthFrom: 'body', widthMul: 0.82, pivotY: 0.3 },
    draw: () => svg(340, 280, `<path d="M 20 40 Q 170 100 320 40 L 320 74 Q 170 134 20 74 Z" fill="#ff7900" ${ST}/><path d="M 110 96 L 230 96 L 250 250 Q 170 274 90 250 Z" fill="#ff7900" ${ST}/><path d="M 120 170 L 220 170" stroke="#e8f0f2" stroke-width="12"/><rect x="146" y="78" width="48" height="40" rx="8" fill="#1f1f1f" ${ST}/><circle cx="170" cy="98" r="8" fill="#bdbdbd"/>`),
  },
  // enfeites
  {
    id: 'flor-cabelo', name: 'Flor de Cabelo', category: 'enfeites', description: 'Hibisco tropical para a orelha.',
    fit: { anchor: 'earL', widthFrom: 'head', widthMul: 0.3, pivotY: 0.5 },
    draw: () => svg(160, 160, `${[0, 72, 144, 216, 288].map((a) => `<ellipse cx="80" cy="44" rx="30" ry="40" transform="rotate(${a} 80 80)" fill="#ff5c7a" ${ST}/>`).join('')}<circle cx="80" cy="80" r="18" fill="#ffd23d" ${ST}/>`),
  },
  {
    id: 'chifres-rena', name: 'Tiara de Rena', category: 'enfeites', description: 'Chifres com sininho para o Natal.',
    fit: { anchor: 'head', widthFrom: 'head', widthMul: 1.1, pivotY: 0.82 },
    draw: () => {
      const antler = (s) => `<path d="M ${170 + s * 70} 150 Q ${170 + s * 90} 80 ${170 + s * 120} 40 M ${170 + s * 98} 92 L ${170 + s * 148} 78 M ${170 + s * 108} 60 L ${170 + s * 100} 20" fill="none" stroke="${INK}" stroke-width="26" stroke-linecap="round"/><path d="M ${170 + s * 70} 150 Q ${170 + s * 90} 80 ${170 + s * 120} 40 M ${170 + s * 98} 92 L ${170 + s * 148} 78 M ${170 + s * 108} 60 L ${170 + s * 100} 20" fill="none" stroke="#9a6334" stroke-width="14" stroke-linecap="round"/>`;
      return svg(340, 190, `${antler(-1)}${antler(1)}<path d="M 40 170 Q 170 120 300 170" fill="none" stroke="${INK}" stroke-width="18" stroke-linecap="round"/><path d="M 40 170 Q 170 120 300 170" fill="none" stroke="#c62f37" stroke-width="8" stroke-linecap="round"/>`);
    },
  },
  {
    id: 'coroa-flores', name: 'Coroa de Flores', category: 'enfeites', description: 'Guirlanda de florzinhas e folhas.',
    fit: { anchor: 'head', widthFrom: 'head', widthMul: 1.05, pivotY: 0.6 },
    draw: () => {
      const items = [];
      for (let i = 0; i <= 8; i++) {
        const t = i / 8;
        const x = 30 + t * 300;
        const y = 70 - Math.sin(t * Math.PI) * 40;
        items.push(`<ellipse cx="${x + 12}" cy="${y + 14}" rx="14" ry="7" transform="rotate(30 ${x + 12} ${y + 14})" fill="#5fae6b" stroke="${INK}" stroke-width="3"/>`);
        const c = ['#ffffff', '#ffb3c7', '#ffd23d'][i % 3];
        items.push(`<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map((a) => `<circle cx="${(11 * Math.cos(a * Math.PI / 180)).toFixed(1)}" cy="${(11 * Math.sin(a * Math.PI / 180)).toFixed(1)}" r="10" fill="${c}" stroke="${INK}" stroke-width="3"/>`).join('')}<circle r="6" fill="#ff7900"/></g>`);
      }
      return svg(360, 110, items.join(''));
    },
  },
  // acessórios de cabelo
  {
    id: 'presilha-estrela', name: 'Presilha Estrela', category: 'acessorios-de-cabelo', description: 'Presilha dourada em forma de estrela.',
    fit: { anchor: 'earR', widthFrom: 'head', widthMul: 0.24, pivotY: 0.5 },
    draw: () => svg(120, 120, star(60, 62, 52, '#f4c430', `stroke="${INK}" stroke-width="6" stroke-linejoin="round"`)),
  },
  {
    id: 'xuxinha-coque', name: 'Xuxinha de Coque', category: 'acessorios-de-cabelo', description: 'Elástico de tecido para prender o topete.',
    fit: { anchor: 'head', widthFrom: 'head', widthMul: 0.32, pivotY: 0.55 },
    draw: () => svg(160, 90, `<path d="M 14 45 Q 20 10 50 18 Q 80 0 110 18 Q 140 10 146 45 Q 140 80 110 72 Q 80 90 50 72 Q 20 80 14 45 Z" fill="#9b7bd6" ${ST}/><path d="M 40 30 Q 50 45 40 60 M 80 24 Q 90 45 80 66 M 120 30 Q 110 45 120 60" fill="none" stroke="#000" stroke-width="4" opacity=".2"/>`),
  },
];
