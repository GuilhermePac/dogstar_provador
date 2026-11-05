// Front-view garments (transparent background) shaped to cover a sitting dog's
// chest and front legs. viewBox 400x440; the collar sits at y≈40 (pivotY .09).
import { shade } from './geometry.mjs';

const INK = '#1b1b1b';
const ST = `stroke="${INK}" stroke-width="6" stroke-linejoin="round" stroke-linecap="round"`;
const wrap = (inner, defs = '', vb = '0 0 400 440') =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${vb}" width="${vb.split(' ')[2]}" height="${vb.split(' ')[3]}"><defs>${defs}</defs>${inner}</svg>`;

// sleeve: 'long' | 'short' | 'none'
function garment(sleeve = 'long') {
  const legBottom = sleeve === 'long' ? 428 : sleeve === 'short' ? 392 : 352;
  const body = 'M 128 34 Q 200 74 272 34 L 332 62 Q 384 128 372 252 L 362 334';
  if (sleeve === 'none') {
    return `${body} Q 300 362 200 356 Q 100 362 38 334 L 28 252 Q 16 128 68 62 Z`;
  }
  return `${body} Q 340 350 318 352 L 318 ${legBottom} L 234 ${legBottom} L 234 352 Q 200 342 166 352 L 166 ${legBottom} L 82 ${legBottom} L 82 352 Q 60 350 38 334 L 28 252 Q 16 128 68 62 Z`;
}
const collar = (c) => `<path d="M 122 32 Q 200 84 278 32" fill="none" stroke="${INK}" stroke-width="22" stroke-linecap="round"/><path d="M 122 32 Q 200 84 278 32" fill="none" stroke="${c}" stroke-width="11" stroke-linecap="round"/>`;
const cuffs = (c, y) => `<rect x="80" y="${y - 22}" width="88" height="22" rx="6" fill="${c}" ${ST}/><rect x="232" y="${y - 22}" width="88" height="22" rx="6" fill="${c}" ${ST}/>`;
const shadeR = `<path d="M 300 70 Q 380 140 366 300 L 300 330 Z" fill="#000" opacity=".08"/>`;
const clip = (id, sleeve) => `<clipPath id="${id}"><path d="${garment(sleeve)}"/></clipPath>`;

const star = (cx, cy, r, fill) => {
  const pts = [];
  for (let i = 0; i < 10; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    pts.push(`${(cx + rr * Math.cos(a)).toFixed(1)},${(cy + rr * Math.sin(a)).toFixed(1)}`);
  }
  return `<polygon points="${pts.join(' ')}" fill="${fill}"/>`;
};

export const CLOTHES = [
  {
    id: 'pijama-estrelas', name: 'Pijama Noite Estrelada', category: 'pijamas',
    description: 'Malha macia de manga longa com estrelas e luas.',
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: [{ id: 'azul', name: 'Azul-noite', hex: '#2e3f6e' }, { id: 'lilas', name: 'Lilás', hex: '#8f7bc4' }],
    draw: (c) => {
      const deco = [];
      [[110, 140, 14], [270, 120, 11], [200, 230, 16], [100, 290, 10], [300, 260, 13], [124, 400, 9], [276, 400, 9]].forEach(([x, y, r]) => deco.push(star(x, y, r, '#ffd65c')));
      deco.push(`<path d="M 300 180 a 18 18 0 1 0 14 28 a 14 14 0 1 1 -14 -28 Z" fill="#fff4cc"/>`);
      return wrap(`<path d="${garment('long')}" fill="${c}" ${ST}/><g clip-path="url(#k)">${deco.join('')}${shadeR}</g>${collar(shade(c, 0.35))}${cuffs(shade(c, 0.35), 428)}`, clip('k', 'long'));
    },
  },
  {
    id: 'pijama-listrado', name: 'Pijama Listrado', category: 'pijamas',
    description: 'Listras largas e punhos canelados para dias preguiçosos.',
    sizes: ['PP', 'P', 'M', 'G'],
    colors: [{ id: 'cinza', name: 'Cinza e branco', hex: '#9aa0a6' }, { id: 'laranja', name: 'Laranja DogStar', hex: '#ff7900' }],
    draw: (c) => wrap(`<path d="${garment('long')}" fill="#fafafa" ${ST}/><g clip-path="url(#k)">${Array.from({ length: 11 }, (_, i) => `<rect x="0" y="${30 + i * 40}" width="400" height="20" fill="${c}"/>`).join('')}${shadeR}</g><path d="${garment('long')}" fill="none" ${ST}/>${collar(c)}${cuffs(c, 428)}`, clip('k', 'long')),
  },
  {
    id: 'camiseta-estrela', name: 'Camiseta Star', category: 'camisetas',
    description: 'Algodão leve com estrela estampada no peito.',
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: [{ id: 'laranja', name: 'Laranja', hex: '#ff7900' }, { id: 'preta', name: 'Preta', hex: '#222222' }, { id: 'branca', name: 'Branca', hex: '#f4f4f4' }],
    draw: (c) => {
      const ink = c === '#f4f4f4' ? '#ff7900' : '#ffffff';
      return wrap(`<path d="${garment('short')}" fill="${c}" ${ST}/><g clip-path="url(#k)">${star(200, 190, 58, ink)}${shadeR}</g>${collar(shade(c, c === '#222222' ? 0.25 : -0.15))}`, clip('k', 'short'));
    },
  },
  {
    id: 'camiseta-listrada', name: 'Camiseta Marinheiro', category: 'camisetas',
    description: 'Listras finas no estilo navy, gola canoa.',
    sizes: ['P', 'M', 'G'],
    colors: [{ id: 'marinho', name: 'Azul-marinho', hex: '#1f3a68' }, { id: 'vermelha', name: 'Vermelha', hex: '#c8323c' }],
    draw: (c) => wrap(`<path d="${garment('short')}" fill="#fbfbfb" ${ST}/><g clip-path="url(#k)">${Array.from({ length: 22 }, (_, i) => `<rect x="0" y="${60 + i * 18}" width="400" height="8" fill="${c}"/>`).join('')}${shadeR}</g><path d="${garment('short')}" fill="none" ${ST}/>${collar(c)}`, clip('k', 'short')),
  },
  {
    id: 'vestido-floral', name: 'Vestido Jardim', category: 'vestidos',
    description: 'Saia rodada com babado e estampa floral delicada.',
    sizes: ['PP', 'P', 'M'],
    colors: [{ id: 'rosa', name: 'Rosa', hex: '#f29bb8' }, { id: 'amarelo', name: 'Amarelo', hex: '#f6c945' }],
    draw: (c) => {
      const top = 'M 128 34 Q 200 74 272 34 L 332 62 Q 372 120 360 220 L 140 220 L 40 220 Q 28 120 68 62 Z';
      const skirt = 'M 44 214 L 356 214 Q 392 320 396 400 Q 300 432 200 428 Q 100 432 4 400 Q 8 320 44 214 Z';
      const flowers = [[80, 300], [160, 340], [250, 310], [320, 370], [120, 390], [210, 390], [330, 270], [70, 250]].map(([x, y]) =>
        `<g transform="translate(${x} ${y})">${[0, 72, 144, 216, 288].map((a) => `<circle cx="${(9 * Math.cos(a * Math.PI / 180)).toFixed(1)}" cy="${(9 * Math.sin(a * Math.PI / 180)).toFixed(1)}" r="7" fill="#fff"/>`).join('')}<circle r="5" fill="#ff7900"/></g>`).join('');
      return wrap(`<path d="${skirt}" fill="${c}" ${ST}/><g clip-path="url(#s)">${flowers}<path d="M 330 214 L 400 214 L 400 440 L 300 440 Z" fill="#000" opacity=".08"/></g><path d="M 4 400 Q 30 430 56 410 Q 82 436 108 414 Q 134 440 160 418 Q 186 442 212 420 Q 238 442 264 418 Q 290 440 316 414 Q 342 436 368 410 Q 390 428 396 400" fill="${shade(c, 0.4)}" ${ST}/><path d="${top}" fill="${shade(c, -0.12)}" ${ST}/><rect x="36" y="200" width="328" height="26" rx="13" fill="#fff" ${ST}/>${collar(shade(c, 0.4))}`, `<clipPath id="s"><path d="${skirt}"/></clipPath>`);
    },
  },
  {
    id: 'moletom-capuz', name: 'Moletom com Capuz', category: 'moletons',
    description: 'Moletom felpado com capuz, bolso canguru e punhos.',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [{ id: 'cinza', name: 'Cinza mescla', hex: '#a7a9ac' }, { id: 'laranja', name: 'Laranja', hex: '#ff7900' }, { id: 'verde', name: 'Verde-oliva', hex: '#6f7a45' }],
    draw: (c) => wrap(`<path d="M 110 50 Q 200 -20 290 50 Q 290 90 200 92 Q 110 90 110 50 Z" fill="${shade(c, -0.18)}" ${ST}/><path d="${garment('long')}" fill="${c}" ${ST}/><g clip-path="url(#k)"><path d="M 120 220 L 280 220 L 300 312 L 100 312 Z" fill="${shade(c, -0.1)}" stroke="${INK}" stroke-width="5"/>${shadeR}</g><path d="M 150 60 L 156 140 M 250 60 L 244 140" stroke="#fff" stroke-width="6" stroke-linecap="round"/><circle cx="156" cy="146" r="7" fill="#fff" stroke="${INK}" stroke-width="3"/><circle cx="244" cy="146" r="7" fill="#fff" stroke="${INK}" stroke-width="3"/>${cuffs(shade(c, -0.18), 428)}`, clip('k', 'long')),
  },
  {
    id: 'jaqueta-jeans', name: 'Jaqueta Jeans', category: 'jaquetas',
    description: 'Jeans lavado com botões, bolsos e gola dobrada.',
    sizes: ['P', 'M', 'G'],
    colors: [{ id: 'jeans', name: 'Jeans médio', hex: '#5a7fb0' }, { id: 'escuro', name: 'Jeans escuro', hex: '#2f4a73' }],
    draw: (c) => wrap(`<path d="${garment('short')}" fill="${c}" ${ST}/><g clip-path="url(#k)"><path d="M 200 60 L 200 360" stroke="${INK}" stroke-width="5"/>${[120, 190, 260].map((y) => `<circle cx="214" cy="${y}" r="7" fill="#d9b25b" stroke="${INK}" stroke-width="3"/>`).join('')}<rect x="92" y="150" width="70" height="56" rx="6" fill="${shade(c, -0.1)}" stroke="${INK}" stroke-width="4"/><rect x="238" y="150" width="70" height="56" rx="6" fill="${shade(c, -0.1)}" stroke="${INK}" stroke-width="4"/><path d="M 60 120 L 340 120" stroke="#f2c36b" stroke-width="3" stroke-dasharray="8 7"/>${shadeR}</g><path d="M 120 30 L 200 104 L 158 112 Z M 280 30 L 200 104 L 242 112 Z" fill="${shade(c, -0.2)}" ${ST}/>`, clip('k', 'short')),
  },
  {
    id: 'jaqueta-puffer', name: 'Jaqueta Puffer', category: 'roupas-de-inverno',
    description: 'Acolchoada e impermeável, com zíper e gola alta.',
    sizes: ['P', 'M', 'G', 'GG'],
    colors: [{ id: 'laranja', name: 'Laranja', hex: '#ff7900' }, { id: 'preta', name: 'Preta', hex: '#262626' }, { id: 'vinho', name: 'Vinho', hex: '#7b2737' }],
    draw: (c) => wrap(`<path d="${garment('long')}" fill="${c}" ${ST}/><g clip-path="url(#k)">${[110, 170, 230, 290, 350, 410].map((y) => `<path d="M 0 ${y} Q 100 ${y + 14} 200 ${y} Q 300 ${y + 14} 400 ${y}" fill="none" stroke="${INK}" stroke-width="4" opacity=".55"/>`).join('')}<path d="M 200 70 L 200 360" stroke="#d0d0d0" stroke-width="8"/><path d="M 200 70 L 200 360" stroke="${INK}" stroke-width="2" stroke-dasharray="4 4"/>${shadeR}<ellipse cx="120" cy="140" rx="30" ry="12" fill="#fff" opacity=".18"/></g><path d="M 118 22 Q 200 70 282 22 L 288 52 Q 200 104 112 52 Z" fill="${shade(c, -0.15)}" ${ST}/>`, clip('k', 'long')),
  },
  {
    id: 'cachecol-tricot', name: 'Suéter Tricô', category: 'roupas-de-inverno',
    description: 'Tricô com tranças e gola rulê para o frio do Paraná.',
    sizes: ['PP', 'P', 'M', 'G'],
    colors: [{ id: 'creme', name: 'Creme', hex: '#e9dcc3' }, { id: 'vermelho', name: 'Vermelho', hex: '#b8323a' }],
    draw: (c) => wrap(`<path d="${garment('long')}" fill="${c}" ${ST}/><g clip-path="url(#k)">${[110, 200, 290].map((x) => `<path d="M ${x} 60 ${Array.from({ length: 9 }, (_, i) => `q ${i % 2 ? -18 : 18} 20 0 40`).join(' ')}" fill="none" stroke="${shade(c, -0.25)}" stroke-width="7"/>`).join('')}${shadeR}</g><path d="M 116 20 Q 200 70 284 20 L 290 60 Q 200 112 110 60 Z" fill="${shade(c, -0.1)}" ${ST}/>${cuffs(shade(c, -0.1), 428)}`, clip('k', 'long')),
  },
  {
    id: 'regata-tropical', name: 'Regata Tropical', category: 'roupas-de-verao',
    description: 'Regata fresquinha com folhagens, ideal para o calor.',
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: [{ id: 'verde', name: 'Verde-folha', hex: '#2f8f6a' }, { id: 'coral', name: 'Coral', hex: '#ff8a65' }],
    draw: (c) => {
      const leaves = [[90, 120, 20], [250, 100, -30], [170, 220, 60], [320, 230, 10], [80, 300, -40], [260, 300, 40]].map(([x, y, r]) =>
        `<g transform="translate(${x} ${y}) rotate(${r})"><path d="M 0 -42 Q 30 0 0 42 Q -30 0 0 -42 Z" fill="${shade(c, 0.45)}"/><path d="M 0 -38 L 0 38" stroke="${shade(c, -0.2)}" stroke-width="3"/></g>`).join('');
      return wrap(`<path d="${garment('none')}" fill="${c}" ${ST}/><g clip-path="url(#k)">${leaves}${shadeR}</g>${collar(shade(c, -0.15))}`, clip('k', 'none'));
    },
  },
  {
    id: 'fantasia-abelha', name: 'Fantasia Abelhinha', category: 'fantasias',
    description: 'Listras amarelas e pretas com asinhas de tule.',
    sizes: ['PP', 'P', 'M', 'G'],
    colors: [{ id: 'classica', name: 'Clássica', hex: '#f7c600' }],
    draw: (c) => wrap(`<g opacity=".9"><ellipse cx="66" cy="96" rx="64" ry="44" transform="rotate(-25 66 96)" fill="#eaf6ff" ${ST}/><ellipse cx="334" cy="96" rx="64" ry="44" transform="rotate(25 334 96)" fill="#eaf6ff" ${ST}/></g><path d="${garment('short')}" fill="${c}" ${ST}/><g clip-path="url(#k)">${[110, 200, 290, 380].map((y) => `<rect x="0" y="${y}" width="400" height="44" fill="#1f1f1f"/>`).join('')}${shadeR}</g><path d="${garment('short')}" fill="none" ${ST}/>${collar('#1f1f1f')}`, clip('k', 'short'), '0 0 400 440'),
  },
  {
    id: 'fantasia-dino', name: 'Fantasia Dino', category: 'fantasias',
    description: 'Dinossauro de pelúcia com espinhos macios nos ombros.',
    sizes: ['P', 'M', 'G'],
    colors: [{ id: 'verde', name: 'Verde', hex: '#5cae5a' }, { id: 'roxo', name: 'Roxo', hex: '#8a63c9' }],
    draw: (c) => {
      const spikes = [[70, 70], [110, 40], [290, 40], [330, 70]].map(([x, y]) => `<path d="M ${x - 24} ${y + 22} L ${x} ${y - 26} L ${x + 24} ${y + 22} Z" fill="#ffcf4a" ${ST}/>`).join('');
      return wrap(`${spikes}<path d="${garment('long')}" fill="${c}" ${ST}/><g clip-path="url(#k)"><ellipse cx="200" cy="250" rx="90" ry="110" fill="${shade(c, 0.45)}"/>${[200, 240, 280, 320].map((y) => `<path d="M 130 ${y} Q 200 ${y + 14} 270 ${y}" fill="none" stroke="${shade(c, -0.2)}" stroke-width="4"/>`).join('')}${shadeR}</g>${collar(shade(c, -0.2))}`, clip('k', 'long'));
    },
  },
  {
    id: 'fantasia-heroi', name: 'Capa de Super-Herói', category: 'fantasias',
    description: 'Collant com estrela no peito e capa esvoaçante.',
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: [{ id: 'azul', name: 'Azul e vermelho', hex: '#2c56c9' }, { id: 'preto', name: 'Preto e laranja', hex: '#222222' }],
    draw: (c) => {
      const cape = c === '#222222' ? '#ff7900' : '#d4313b';
      return wrap(`<path d="M 110 40 L 0 420 Q 200 440 400 420 L 290 40 Z" fill="${cape}" ${ST}/><path d="${garment('short')}" fill="${c}" ${ST}/><g clip-path="url(#k)"><circle cx="200" cy="190" r="62" fill="#ffd23d" stroke="${INK}" stroke-width="5"/>${star(200, 192, 44, cape)}${shadeR}</g>${collar(cape)}`, clip('k', 'short'));
    },
  },
  {
    id: 'camisa-junina', name: 'Camisa Xadrez Junina', category: 'roupas-tematicas',
    description: 'Xadrez com remendos para arraiá e festas juninas.',
    sizes: ['P', 'M', 'G'],
    colors: [{ id: 'vermelha', name: 'Vermelha', hex: '#c9363e' }, { id: 'azul', name: 'Azul', hex: '#2e64b5' }],
    draw: (c) => {
      const defs = `${clip('k', 'short')}<pattern id="pl" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="${c}"/><rect width="60" height="20" y="20" fill="#000" opacity=".22"/><rect width="20" height="60" x="20" fill="#000" opacity=".22"/><rect width="60" height="4" y="48" fill="#fff" opacity=".5"/><rect width="4" height="60" x="48" fill="#fff" opacity=".5"/></pattern>`;
      return wrap(`<path d="${garment('short')}" fill="url(#pl)" ${ST}/><g clip-path="url(#k)"><rect x="236" y="250" width="56" height="50" fill="#e9c46a" stroke="${INK}" stroke-width="4" stroke-dasharray="7 5" transform="rotate(8 264 275)"/><rect x="100" y="120" width="44" height="40" fill="#8ecae6" stroke="${INK}" stroke-width="4" stroke-dasharray="7 5" transform="rotate(-10 122 140)"/>${shadeR}</g>${collar('#f1e3c6')}`, defs);
    },
  },
  {
    id: 'blusa-natal', name: 'Blusa de Natal', category: 'roupas-tematicas',
    description: 'Tricô natalino com flocos de neve e barra branca.',
    sizes: ['PP', 'P', 'M', 'G', 'GG'],
    colors: [{ id: 'vermelha', name: 'Vermelha', hex: '#c62f37' }, { id: 'verde', name: 'Verde', hex: '#237a4b' }],
    draw: (c) => {
      const flake = (x, y) => `<g transform="translate(${x} ${y})" stroke="#fff" stroke-width="4" stroke-linecap="round">${[0, 60, 120].map((a) => `<path d="M 0 -16 L 0 16" transform="rotate(${a})"/>`).join('')}</g>`;
      return wrap(`<path d="${garment('long')}" fill="${c}" ${ST}/><g clip-path="url(#k)">${[[110, 140], [200, 200], [290, 140], [150, 280], [260, 280]].map(([x, y]) => flake(x, y)).join('')}<rect x="0" y="322" width="400" height="34" fill="#fff"/>${shadeR}</g><path d="${garment('long')}" fill="none" ${ST}/>${collar('#fff')}${cuffs('#fff', 428)}`, clip('k', 'long'));
    },
  },
];

export const CLOTHES_FIT = { anchor: 'neck', widthFrom: 'body', widthMul: 1.0, pivotY: 0.09 };
