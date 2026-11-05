// Parametric front-view "sitting dog" illustration in the DogStar logo style:
// thick dark outline, flat fills, soft grey shading. Every breed trait
// (ears, muzzle, coat, tail, markings) and every grooming style changes the
// geometry, so each grooming image is a genuinely different drawing.
import { blob, smoothPoly, fringe, shade, hashString, r1 } from './geometry.mjs';

const INK = '#1b1b1b';
const SW = 6.5;
const GROUND = 748;

const SIZE = {
  small: { R: 148, hy: 292, bodyW: 118, legW: 46 },
  medium: { R: 132, hy: 268, bodyW: 128, legW: 50 },
  large: { R: 120, hy: 246, bodyW: 138, legW: 56 },
};

const BASE_FUR = {
  short: { head: 0, body: 0, legs: 0, earFur: 0, ruff: 0, drape: 0, style: 'smooth', tail: 0 },
  medium: { head: 4, body: 10, legs: 10, earFur: 0.7, ruff: 0.55, drape: 0, style: 'tuft', tail: 0.8 },
  long: { head: 26, body: 18, legs: 10, earFur: 1, ruff: 0, drape: 1, faceHair: true, style: 'tuft', tail: 1 },
  double: { head: 22, body: 20, legs: 8, earFur: 0, ruff: 1, drape: 0, style: 'tuft', tail: 1 },
  curly: { head: 40, body: 30, legs: 24, earFur: 1, ruff: 0, drape: 0, style: 'curly', tail: 1 },
  wire: { head: 10, body: 12, legs: 16, earFur: 0.2, ruff: 0, drape: 0, beard: 1, brows: true, style: 'wire', tail: 0.4 },
};

// Grooming styles reshape the coat. Values are absolute (px) unless noted.
const GROOM = {
  natural: {},
  bebe: { head: 22, body: 14, legs: 14, earFur: 0.55, drape: 0, faceHair: false, soften: true, beard: 0.5, ruff: 0.3 },
  ursinho: { head: 50, body: 18, legs: 24, earFur: 0.45, drape: 0, faceHair: false, soften: true, muzzleFluff: true, column: true, beard: 0, ruff: 0.4 },
  tesoura: { head: 26, body: 15, legs: 18, earFur: 0.7, drape: 0, faceHair: false, soften: true, beard: 0.7, ruff: 0.6 },
  maquina: { head: 5, body: 3, legs: 5, earFur: 0.25, drape: 0, faceHair: false, smooth: true, beard: 0.35, brows: false, ruff: 0 },
  higienica: { cleanPaws: true, drapeScale: 0.88 },
  completa: { head: 16, body: 6, legs: 18, earFur: 0.55, drape: 0, faceHair: false, soften: true, ruff: 0.2 },
  asiatica: { head: 42, body: 9, legs: 32, earFur: 1, drape: 0, faceHair: false, soften: true, muzzleFluff: true, column: true, beard: 0, ruff: 0 },
  verao: { head: 14, body: 2, legs: 6, earFur: 0.35, drape: 0, faceHair: false, smooth: true, beard: 0.3, ruff: 0, tailTrim: true },
  personalizada: { head: 20, body: 12, legs: 16, earFur: 0.9, drape: 0, faceHair: false, soften: true, topknot: true, ruff: 0.3 },
};

function furProfile(breed, grooming) {
  const base = { ...BASE_FUR[breed.coat] };
  const g = GROOM[grooming] ?? {};
  // Double coats are only tidied, never shaved: scale the change down.
  if (breed.coat === 'double' && grooming !== 'natural') {
    const tidy = grooming === 'ursinho' ? 1 : 0.75;
    return {
      ...base,
      head: grooming === 'ursinho' ? base.head + 22 : base.head * tidy,
      body: base.body * tidy,
      legs: base.legs * 0.7,
      ruff: base.ruff * tidy,
      cleanPaws: grooming === 'higienica',
      style: grooming === 'ursinho' ? 'soft' : base.style,
    };
  }
  const out = { ...base, ...g };
  if (g.drapeScale) out.drape = base.drape * g.drapeScale;
  if (base.style === 'curly') out.style = 'curly';
  else if (g.smooth) out.style = breed.coat === 'wire' ? 'wire' : 'soft';
  else if (g.soften) out.style = breed.coat === 'wire' ? 'wire' : 'soft';
  out.bodyStyle = out.style;
  if (base.style === 'curly' && ['maquina', 'verao', 'asiatica', 'completa'].includes(grooming)) out.bodyStyle = 'soft';
  if (base.style === 'curly' && grooming === 'natural') { out.body = 42; out.legs = 30; out.head = 46; }
  if (breed.coat !== 'wire') { out.beard = 0; out.brows = false; }
  else if (out.beard === undefined) out.beard = base.beard;
  if (out.brows === undefined) out.brows = base.brows;
  if (breed.ear === 'erect' || breed.ear === 'bat') out.earFur = Math.min(out.earFur ?? 0, 0.2);
  return out;
}

function lum(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return (0.2126 * ((n >> 16) & 255) + 0.7152 * ((n >> 8) & 255) + 0.0722 * (n & 255)) / 255;
}

const ampFor = (extra, r, style) => (style === 'smooth' ? 0 : Math.min(0.32, 0.05 + extra / (r * 2.2)));

export function drawDog({ id, breed, colors, grooming = 'natural', tongue = false }) {
  const S = { ...SIZE[breed.size] };
  if (breed.build === 'stocky') { S.bodyW *= 1.14; S.legW *= 1.15; S.R *= 1.04; }
  if (breed.build === 'slim') { S.bodyW *= 0.86; S.legW *= 0.82; }
  if (breed.build === 'lowrider') { S.hy += 22; S.bodyW *= 1.04; }
  const { R, hy, legW } = S;
  const bodyW = S.bodyW;
  const fur = furProfile(breed, grooming);
  const seed = hashString(id + grooming);
  const uid = `d${seed.toString(36)}`;
  const C = {
    base: colors.base,
    light: colors.light ?? shade(colors.base, 0.55),
    dark: colors.dark ?? shade(colors.base, -0.45),
    tan: colors.tan ?? '#c47a35',
    ears: colors.ears ?? colors.base,
    muzzle: colors.muzzle ?? colors.light ?? colors.base,
    chest: colors.chest ?? colors.light ?? colors.base,
    paws: colors.paws ?? colors.chest ?? colors.base,
    hair: colors.hair ?? colors.base,
    tail: colors.tail ?? colors.base,
    inner: '#f2a7b8',
  };
  const BF = fur.drape === 0 && breed.coat === 'long' ? C.hair : C.base;
  const m = colors.markings ?? breed.markings ?? [];
  const has = (k) => m.includes(k);

  const neckY = hy + R * 0.82;
  const torsoTop = neckY - 20;
  const torsoCy = (torsoTop + GROUND) / 2 + 12;
  const torsoRy = (GROUND - torsoTop) / 2 + 4;
  const bodyStyle = fur.bodyStyle ?? fur.style;
  const coatStyle = fur.style;
  const bw = bodyW + fur.body;
  const headRx = R * (breed.muzzle === 'flat' ? 1.06 : 1) + fur.head;
  const headRy = R * 0.92 + fur.head * 0.92;
  const legX = bodyW * 0.42;
  const legTop = neckY + (GROUND - neckY) * 0.32;
  const lw = legW + fur.legs;

  const back = [];
  const body = [];
  const head = [];
  const defs = [];
  const stroke = `stroke="${INK}" stroke-width="${SW}" stroke-linejoin="round" stroke-linecap="round"`;

  // ---------- shadow
  back.push(`<ellipse cx="400" cy="${GROUND + 4}" rx="${r1(bw * 1.9)}" ry="18" fill="#000" opacity=".13"/>`);

  // ---------- tail (behind)
  const tailX = 400 + bw * 0.98;
  const tailFur = fur.tailTrim ? 0.3 : fur.tail ?? 0;
  if (breed.tail === 'curl') {
    const tr = 42 + tailFur * 24;
    back.push(`<path d="${blob(tailX + 8, torsoTop + 90, tr, tr * 0.9, { style: tailFur > 0.2 ? (coatStyle === 'curly' ? 'curly' : 'tuft') : 'smooth', amp: 0.18, n: 11, seed })}" fill="${C.tail}" ${stroke}/>`);
  } else if (breed.tail === 'plume' || breed.tail === 'pom') {
    if (breed.tail === 'pom') {
      back.push(`<path d="M ${r1(tailX - 30)} 650 Q ${r1(tailX + 30)} 610 ${r1(tailX + 26)} 520" fill="none" stroke="${INK}" stroke-width="26" stroke-linecap="round"/>`);
      back.push(`<path d="M ${r1(tailX - 30)} 650 Q ${r1(tailX + 30)} 610 ${r1(tailX + 26)} 520" fill="none" stroke="${C.tail}" stroke-width="13" stroke-linecap="round"/>`);
      back.push(`<path d="${blob(tailX + 26, 505, 36 + tailFur * 6, 36, { style: 'curly', amp: 0.2, n: 9, seed })}" fill="${C.tail}" ${stroke}/>`);
    } else {
      back.push(`<path transform="rotate(28 ${r1(tailX + 20)} 590)" d="${blob(tailX + 20, 590, 34 + tailFur * 14, 104, { style: tailFur > 0.2 ? 'tuft' : 'smooth', amp: 0.16 + tailFur * 0.08, n: 12, seed })}" fill="${C.tail}" ${stroke}/>`);
    }
  } else if (breed.tail === 'thin') {
    const d = `M ${r1(tailX - 40)} 690 Q ${r1(tailX + 70)} 680 ${r1(tailX + 40)} 548`;
    back.push(`<path d="${d}" fill="none" stroke="${INK}" stroke-width="30" stroke-linecap="round"/>`);
    back.push(`<path d="${d}" fill="none" stroke="${C.tail}" stroke-width="17" stroke-linecap="round"/>`);
    if (has('tailTip')) back.push(`<circle cx="${r1(tailX + 40)}" cy="550" r="9" fill="${C.light}"/>`);
  }

  // ---------- haunches + back paws
  for (const s of [-1, 1]) {
    const hx = 400 + s * bw * 0.92;
    back.push(`<path d="${blob(hx, 682, bodyW * 0.56 + fur.body * 0.7, 64 + fur.body * 0.5, { style: bodyStyle, amp: ampFor(fur.body, 60, bodyStyle), n: 9, seed: seed + s })}" fill="${BF}" ${stroke}/>`);
    back.push(`<ellipse cx="${r1(400 + s * bw * 1.22)}" cy="${GROUND - 14}" rx="${r1(legW * 0.62)}" ry="19" fill="${C.paws}" ${stroke}/>`);
  }

  // ---------- torso
  defs.push(`<clipPath id="${uid}t"><path d="${blob(400, torsoCy, bw, torsoRy, { style: bodyStyle, amp: ampFor(fur.body, bw, bodyStyle), n: 12, seed })}"/></clipPath>`);
  body.push(`<path d="${blob(400, torsoCy, bw, torsoRy, { style: bodyStyle, amp: ampFor(fur.body, bw, bodyStyle), n: 12, seed })}" fill="${BF}" ${stroke}/>`);
  const torsoClip = [];
  if (!has('noChest')) torsoClip.push(`<ellipse cx="400" cy="${r1(torsoCy - torsoRy * 0.2)}" rx="${r1(bw * 0.55)}" ry="${r1(torsoRy * 0.75)}" fill="${C.chest}"/>`);
  if (has('saddle')) torsoClip.push(`<ellipse cx="${r1(400 + bw * 0.9)}" cy="${r1(torsoCy - 30)}" rx="${r1(bw * 0.55)}" ry="${r1(torsoRy * 0.9)}" fill="${C.dark}"/><ellipse cx="${r1(400 - bw * 0.9)}" cy="${r1(torsoCy - 30)}" rx="${r1(bw * 0.55)}" ry="${r1(torsoRy * 0.9)}" fill="${C.dark}"/>`);
  if (has('spots')) {
    for (let i = 0; i < 9; i++) {
      const sx = 400 + Math.sin(seed + i * 7.3) * bw * 0.75;
      const sy = torsoCy + Math.cos(seed + i * 3.1) * torsoRy * 0.7;
      torsoClip.push(`<circle cx="${r1(sx)}" cy="${r1(sy)}" r="${r1(7 + (i % 3) * 3)}" fill="${C.dark}"/>`);
    }
  }
  torsoClip.push(`<ellipse cx="400" cy="${r1(torsoTop + 10)}" rx="${r1(bw * 0.9)}" ry="46" fill="#000" opacity=".10"/>`);
  torsoClip.push(`<ellipse cx="${r1(400 + bw * 0.95)}" cy="${r1(torsoCy + 30)}" rx="${r1(bw * 0.45)}" ry="${r1(torsoRy)}" fill="#000" opacity=".07"/>`);
  body.push(`<g clip-path="url(#${uid}t)">${torsoClip.join('')}</g>`);

  // ---------- front legs
  const pawColor = has('tanPaws') ? C.tan : C.paws;
  for (const s of [-1, 1]) {
    const x = 400 + s * legX;
    if (fur.column || (fur.legs > 14 && bodyStyle !== 'smooth')) {
      const st = coatStyle === 'curly' ? 'curly' : fur.column ? 'soft' : bodyStyle;
      body.push(`<path d="${blob(x, (legTop + GROUND) / 2, lw / 2, (GROUND - legTop) / 2, { style: st, amp: 0.12, n: 9, seed: seed + 9 * s })}" fill="${BF}" ${stroke}/>`);
    } else {
      body.push(`<rect x="${r1(x - lw / 2)}" y="${r1(legTop)}" width="${r1(lw)}" height="${r1(GROUND - legTop)}" rx="${r1(lw / 2)}" fill="${BF}" ${stroke}/>`);
      if (has('tanPaws') || has('socks')) {
        body.push(`<rect x="${r1(x - lw / 2 + SW / 2)}" y="${r1(GROUND - 70)}" width="${r1(lw - SW)}" height="60" rx="${r1(lw / 2.4)}" fill="${pawColor}"/>`);
      }
    }
  }

  // ---------- long hair drape (natural long coats)
  if (fur.drape > 0) {
    const top = hy - R * 0.25;
    const bottom = GROUND - 4 - (1 - fur.drape) * 150;
    const side = bw * 0.92 + bodyW * 0.62 + 18;
    const d = `M ${r1(400 - headRx * 0.92)} ${r1(top)} C ${r1(400 - headRx * 1.12)} ${r1(top + 170)} ${r1(400 - side - 6)} ${r1(top + 230)} ${r1(400 - side)} ${r1(bottom)}` +
      fringe(400 - side, 400 + side, bottom, { tips: 12, depth: 12, seed }) +
      ` C ${r1(400 + side + 6)} ${r1(top + 230)} ${r1(400 + headRx * 1.12)} ${r1(top + 170)} ${r1(400 + headRx * 0.92)} ${r1(top)} Z`;
    body.push(`<path d="${d}" fill="${C.hair}" ${stroke}/>`);
    defs.push(`<clipPath id="${uid}d"><path d="${d}"/></clipPath>`);
    const lines = [];
    for (let i = -4; i <= 4; i++) {
      if (i === 0) continue;
      const x0 = 400 + i * headRx * 0.2;
      const x1 = 400 + i * side * 0.22;
      lines.push(`<path d="M ${r1(x0)} ${r1(top + 60)} C ${r1(x0 + i * 6)} ${r1(top + 180)} ${r1(x1)} ${r1(bottom - 150)} ${r1(x1 + i * 3)} ${r1(bottom - 20)}" fill="none" stroke="#000" stroke-width="4" opacity=".08" stroke-linecap="round"/>`);
    }
    if (colors.hairPatch) lines.push(`<ellipse cx="${r1(400 + side * 0.75)}" cy="${r1(top + 260)}" rx="${r1(side * 0.45)}" ry="160" fill="${colors.hairPatch}"/>`);
    lines.push(`<ellipse cx="${r1(400 + side * 0.85)}" cy="${r1(bottom - 120)}" rx="${r1(side * 0.35)}" ry="200" fill="#000" opacity=".06"/>`);
    body.push(`<g clip-path="url(#${uid}d)">${lines.join('')}</g>`);
  }

  // ---------- front paws (always visible)
  for (const s of [-1, 1]) {
    const x = 400 + s * legX;
    const pw = (fur.cleanPaws || fur.drape === 0 ? legW * 0.6 : legW * 0.66) + (fur.column ? fur.legs * 0.32 : 0);
    body.push(`<ellipse cx="${r1(x)}" cy="${GROUND - 12}" rx="${r1(pw)}" ry="20" fill="${pawColor}" ${stroke}/>`);
    body.push(`<path d="M ${r1(x - pw * 0.3)} ${GROUND - 22} v 14 M ${r1(x + pw * 0.3)} ${GROUND - 22} v 14" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`);
  }

  // ---------- chest ruff / mane
  if (fur.ruff > 0) {
    const rr = bw * (0.7 + fur.ruff * 0.3);
    body.push(`<path d="${blob(400, neckY + 40, rr, 58 + fur.ruff * 30, { style: bodyStyle === 'smooth' ? 'tuft' : bodyStyle === 'curly' ? 'curly' : 'tuft', amp: 0.16, n: 10, seed: seed + 4 })}" fill="${has('ruffLight') ? C.light : C.chest}" ${stroke}/>`);
  }

  // ---------- ears (behind head)
  const ear = breed.ear;
  const earBack = [];
  const earFront = [];
  const earTop = hy - headRy * 0.7;
  for (const s of [-1, 1]) {
    if (ear === 'erect' || ear === 'bat') {
      const big = ear === 'bat' ? 1.18 : 1;
      const h = (breed.earSize ?? 1) * big;
      const inner = [400 + s * R * 0.24, hy - R * 0.74];
      const outer = [400 + s * R * 0.9, hy - R * 0.2];
      const tip = [400 + s * R * (0.78 + (big - 1) * 1.2), hy - R * (0.95 + 0.5 * h)];
      const d = `M ${r1(inner[0])} ${r1(inner[1])} Q ${r1(tip[0] - s * R * 0.12)} ${r1(tip[1] + R * 0.1)} ${r1(tip[0])} ${r1(tip[1])} Q ${r1(tip[0] + s * R * 0.16)} ${r1(tip[1] + R * 0.3)} ${r1(outer[0])} ${r1(outer[1])} Z`;
      earBack.push(`<path d="${d}" fill="${C.ears}" ${stroke}/>`);
      const cx = (inner[0] + outer[0] + tip[0]) / 3;
      const cy = (inner[1] + outer[1] + tip[1]) / 3;
      const k = 0.55;
      const sc = (p) => [cx + (p[0] - cx) * k, cy + (p[1] - cy) * k + 6];
      const [a, b, c] = [sc(inner), sc(tip), sc(outer)];
      earBack.push(`<path d="M ${r1(a[0])} ${r1(a[1])} Q ${r1(b[0] - s * 6)} ${r1(b[1] + 8)} ${r1(b[0])} ${r1(b[1])} Q ${r1(b[0] + s * 8)} ${r1(b[1] + 18)} ${r1(c[0])} ${r1(c[1])} Z" fill="${breed.coat === 'double' || breed.coat === 'long' ? C.light : C.inner}" opacity=".95"/>`);
    } else if (ear === 'folded' || ear === 'semi') {
      const pts = [
        [400 + s * R * 0.34, hy - R * 0.8],
        [400 + s * R * 0.82, hy - R * (ear === 'semi' ? 1.18 : 1.02)],
        [400 + s * R * 1.0, hy - R * 0.55],
        [400 + s * R * 0.78, hy - R * 0.36],
      ];
      earFront.push(`<path d="${smoothPoly(pts)}" fill="${C.ears}" ${stroke}/>`);
    } else if (ear === 'button') {
      const pts = [
        [400 + s * R * 0.5, hy - R * 0.86],
        [400 + s * R * 1.04, hy - R * 0.82],
        [400 + s * R * 1.02, hy - R * 0.32],
        [400 + s * R * 0.78, hy - R * 0.5],
      ];
      earFront.push(`<path d="${smoothPoly(pts)}" fill="${C.ears}" ${stroke}/>`);
    } else {
      // floppy | long | drop (hairy)
      const long = ear === 'long' || ear === 'drop';
      const L = R * (long ? 1.3 : 0.98) * (1 + (fur.earFur ?? 0) * 0.28) * (fur.drape > 0 ? 1.35 : 1);
      const W = R * (long ? 0.5 : 0.44) * (1 + (fur.earFur ?? 0) * 0.3);
      const ax = 400 + s * (headRx - W * 0.35);
      const ay = earTop + 6;
      if ((fur.earFur ?? 0) > 0.45 || ear === 'drop') {
        const st = coatStyle === 'curly' ? 'curly' : coatStyle === 'smooth' ? 'soft' : coatStyle;
        earFront.push(`<path d="${blob(ax + s * W * 0.32, ay + L * 0.5, W * 0.62, L * 0.55, { style: st, amp: 0.14, n: 10, seed: seed + 20 * s })}" fill="${C.ears}" ${stroke}/>`);
      } else {
        const pts = [
          [ax - s * W * 0.15, ay],
          [ax + s * W * 0.95, ay + L * 0.3],
          [ax + s * W * 0.75, ay + L * 1.02],
          [ax + s * W * 0.0, ay + L * 0.82],
        ];
        earFront.push(`<path d="${smoothPoly(pts)}" fill="${C.ears}" ${stroke}/>`);
      }
    }
  }
  head.push(...earBack);

  // ---------- head
  const headStyle = fur.head > 8 ? (coatStyle === 'smooth' ? 'soft' : coatStyle) : 'smooth';
  const headD = blob(400, hy, headRx, headRy, { style: headStyle, amp: ampFor(fur.head, R, headStyle), n: 14, seed: seed + 2, rot: -Math.PI / 2 });
  defs.push(`<clipPath id="${uid}h"><path d="${headD}"/></clipPath>`);
  head.push(`<path d="${headD}" fill="${C.base}" ${stroke}/>`);
  const hc = [];
  if (has('lowerFace')) hc.push(`<ellipse cx="400" cy="${r1(hy + R * 0.62)}" rx="${r1(headRx * 0.82)}" ry="${r1(R * 0.62)}" fill="${C.light}"/>`);
  if (has('blaze')) hc.push(`<path d="M ${r1(400 - R * 0.07)} ${r1(hy - headRy)} L ${r1(400 + R * 0.07)} ${r1(hy - headRy)} L ${r1(400 + R * 0.26)} ${r1(hy + R * 0.2)} L ${r1(400 - R * 0.26)} ${r1(hy + R * 0.2)} Z" fill="${C.light}"/>`);
  if (has('cap')) hc.push(`<path d="M ${r1(400 - headRx - 10)} ${r1(hy + R * 0.05)} C ${r1(400 - R * 0.55)} ${r1(hy - R * 0.1)} ${r1(400 - R * 0.62)} ${r1(hy - R * 0.32)} 400 ${r1(hy - R * 0.62)} C ${r1(400 + R * 0.62)} ${r1(hy - R * 0.32)} ${r1(400 + R * 0.55)} ${r1(hy - R * 0.1)} ${r1(400 + headRx + 10)} ${r1(hy + R * 0.05)} L ${r1(400 + headRx + 10)} ${r1(hy - headRy - 30)} L ${r1(400 - headRx - 10)} ${r1(hy - headRy - 30)} Z" fill="${C.dark}"/>`);
  if (has('eyePatch')) hc.push(`<ellipse cx="${r1(400 + R * 0.42)}" cy="${r1(hy - R * 0.18)}" rx="${r1(R * 0.38)}" ry="${r1(R * 0.34)}" fill="${C.dark}"/>`);
  if (has('spots')) {
    for (let i = 0; i < 6; i++) hc.push(`<circle cx="${r1(400 + Math.sin(seed + i * 5.1) * R * 0.75)}" cy="${r1(hy - R * 0.4 + Math.cos(i * 2.7) * R * 0.3)}" r="${r1(6 + (i % 3) * 3)}" fill="${C.dark}"/>`);
  }
  if (has('tanBrows')) for (const s of [-1, 1]) hc.push(`<ellipse cx="${r1(400 + s * R * 0.36)}" cy="${r1(hy - R * 0.32)}" rx="${r1(R * 0.13)}" ry="${r1(R * 0.09)}" fill="${C.tan}"/>`);
  if (has('tanMuzzle')) hc.push(`<ellipse cx="400" cy="${r1(hy + R * 0.55)}" rx="${r1(R * 0.62)}" ry="${r1(R * 0.42)}" fill="${C.tan}"/>`);
  hc.push(`<ellipse cx="${r1(400 + headRx * 0.85)}" cy="${r1(hy + headRy * 0.55)}" rx="${r1(headRx * 0.55)}" ry="${r1(headRy * 0.6)}" fill="#000" opacity=".07"/>`);
  head.push(`<g clip-path="url(#${uid}h)">${hc.join('')}</g>`);

  if (fur.drape > 0 && fur.faceHair) {
    // centre parting of long hair
    head.push(`<path d="M 400 ${r1(hy - headRy + 6)} L 400 ${r1(hy - R * 0.55)}" stroke="${INK}" stroke-width="4" opacity=".35" stroke-linecap="round"/>`);
  }

  // ---------- eyes
  const flat = breed.muzzle === 'flat';
  const eyeY = hy - R * (flat ? 0.04 : 0.1);
  const ex = R * (flat ? 0.42 : 0.35);
  const er = R * (flat ? 0.12 : 0.1);
  const faceTop = [];
  if (fur.brows) {
    for (const s of [-1, 1]) faceTop.push(`<path d="${blob(400 + s * ex * 0.95, eyeY - er * 1.6, er * 2.1, er * 0.95, { style: 'wire', amp: 0.25, n: 7, seed: seed + s * 3 })}" fill="${colors.beard ?? C.light}" ${stroke.replace(String(SW), '4.5')}/>`);
  }
  const darkFace = lum(C.base) < 0.2 && !has('lowerFace');
  for (const s of [-1, 1]) {
    if (darkFace) head.push(`<ellipse cx="${r1(400 + s * ex)}" cy="${r1(eyeY)}" rx="${r1(er * 1.35)}" ry="${r1(er * 1.45)}" fill="${shade(C.base, 0.32)}"/>`);
    head.push(`<ellipse cx="${r1(400 + s * ex)}" cy="${r1(eyeY)}" rx="${r1(er)}" ry="${r1(er * 1.12)}" fill="${INK}"/>`);
    head.push(`<circle cx="${r1(400 + s * ex + er * 0.35)}" cy="${r1(eyeY - er * 0.4)}" r="${r1(er * 0.34)}" fill="#fff"/>`);
  }
  head.push(...faceTop);

  // ---------- muzzle
  const MZ = {
    flat: { w: 0.5, h: 0.3, y: 0.36, bridge: 0 },
    short: { w: 0.42, h: 0.32, y: 0.42, bridge: 0.18 },
    medium: { w: 0.37, h: 0.36, y: 0.5, bridge: 0.2 },
    long: { w: 0.3, h: 0.46, y: 0.6, bridge: 0.17 },
  }[breed.muzzle];
  const mw = R * MZ.w * (fur.muzzleFluff ? 1.25 : 1);
  const mh = R * MZ.h * (fur.muzzleFluff ? 1.15 : 1);
  const my = hy + R * MZ.y;
  const muzzleFill = has('darkMuzzle') ? C.dark : C.muzzle;
  if (MZ.bridge) {
    const bwd = R * MZ.bridge;
    const pts = [
      [400 - bwd, eyeY + er * 0.6], [400 + bwd, eyeY + er * 0.6],
      [400 + mw * 1.05, my - mh * 0.1], [400 + mw * 0.7, my + mh * 0.85],
      [400 - mw * 0.7, my + mh * 0.85], [400 - mw * 1.05, my - mh * 0.1],
    ];
    const d = smoothPoly(pts);
    head.push(`<path d="${d}" fill="${muzzleFill}" stroke="${INK}" stroke-width="4.5" stroke-linejoin="round" opacity="1"/>`);
  } else {
    const st = fur.muzzleFluff ? (coatStyle === 'curly' ? 'curly' : 'soft') : 'smooth';
    head.push(`<path d="${blob(400, my, mw, mh, { style: st, amp: 0.1, n: 9, seed })}" fill="${muzzleFill}" stroke="${INK}" stroke-width="4.5"/>`);
  }
  if (has('wrinkles')) head.push(`<path d="M ${r1(400 - R * 0.22)} ${r1(eyeY - er * 2.2)} q ${r1(R * 0.22)} -10 ${r1(R * 0.44)} 0 M ${r1(400 - R * 0.16)} ${r1(eyeY - er * 3.1)} q ${r1(R * 0.16)} -8 ${r1(R * 0.32)} 0" fill="none" stroke="${INK}" stroke-width="4" opacity=".5" stroke-linecap="round"/>`);

  // mouth + tongue
  const ny = my - mh * (MZ.bridge ? 0.18 : 0.3);
  const nw = R * (flat ? 0.24 : 0.22);
  const nh = R * 0.15;
  const mouthY = ny + nh * 0.5 + R * 0.12;
  if (tongue) head.push(`<path d="M ${r1(400 - R * 0.09)} ${r1(mouthY)} q ${r1(R * 0.09)} ${r1(R * 0.28)} ${r1(R * 0.18)} 0 Z" fill="#ee6f8a" stroke="${INK}" stroke-width="4" stroke-linejoin="round"/>`);
  head.push(`<path d="M 400 ${r1(ny + nh * 0.4)} L 400 ${r1(mouthY)} M ${r1(400 - R * 0.17)} ${r1(mouthY - R * 0.04)} Q ${r1(400 - R * 0.08)} ${r1(mouthY + R * 0.06)} 400 ${r1(mouthY)} Q ${r1(400 + R * 0.08)} ${r1(mouthY + R * 0.06)} ${r1(400 + R * 0.17)} ${r1(mouthY - R * 0.04)}" fill="none" stroke="${INK}" stroke-width="4.5" stroke-linecap="round"/>`);

  // beard / mustache
  if ((fur.beard ?? 0) > 0) {
    const b = fur.beard;
    head.push(`<path d="${blob(400, my + mh * 0.75, mw * (0.85 + b * 0.25), mh * (0.6 + b * 0.55), { style: 'wire', amp: 0.2, n: 9, seed: seed + 7, rot: Math.PI / 2 })}" fill="${colors.beard ?? C.light}" ${stroke.replace(String(SW), '4.5')}/>`);
  }
  if (fur.faceHair && fur.drape > 0) {
    head.push(`<path d="${blob(400, my + mh * 0.9, mw * 1.25, mh * 1.05, { style: 'tuft', amp: 0.2, n: 9, seed: seed + 8, rot: Math.PI / 2 })}" fill="${colors.beard ?? C.muzzle}" ${stroke.replace(String(SW), '4.5')}/>`);
  }
  // nose (on top of beard)
  head.push(`<path d="M ${r1(400 - nw / 2)} ${r1(ny - nh / 2)} Q 400 ${r1(ny - nh * 0.8)} ${r1(400 + nw / 2)} ${r1(ny - nh / 2)} Q ${r1(400 + nw * 0.45)} ${r1(ny + nh * 0.3)} 400 ${r1(ny + nh / 2)} Q ${r1(400 - nw * 0.45)} ${r1(ny + nh * 0.3)} ${r1(400 - nw / 2)} ${r1(ny - nh / 2)} Z" fill="${colors.nose ?? INK}" stroke="${INK}" stroke-width="3"/>`);
  head.push(`<ellipse cx="${r1(400 - nw * 0.15)}" cy="${r1(ny - nh * 0.28)}" rx="${r1(nw * 0.16)}" ry="${r1(nh * 0.14)}" fill="#fff" opacity=".85"/>`);

  // topknot
  const topY = hy - headRy;
  if (fur.topknot || (has('topknot') && grooming === 'natural')) {
    head.push(`<path d="${blob(400, topY - 6, 30, 26, { style: coatStyle === 'curly' ? 'curly' : 'tuft', amp: 0.2, n: 8, seed: seed + 11, rot: -Math.PI / 2 })}" fill="${C.hair}" ${stroke.replace(String(SW), '5')}/>`);
    head.push(`<rect x="384" y="${r1(topY + 10)}" width="32" height="10" rx="5" fill="#555" stroke="${INK}" stroke-width="3"/>`);
  }
  head.push(...earFront);

  // ---------- anchors (fractions of the 800px canvas)
  const A = (x, y, w) => ({ x: +(x / 800).toFixed(4), y: +(y / 800).toFixed(4), w: +(w / 800).toFixed(4) });
  const earAnchorY = hy - headRy * 0.82;
  const anchors = {
    head: A(400, topY + (fur.topknot ? -10 : 8), headRx * 1.55),
    eyes: A(400, eyeY, ex * 2),
    earL: A(400 - headRx * 0.72, earAnchorY, R * 0.5),
    earR: A(400 + headRx * 0.72, earAnchorY, R * 0.5),
    neck: A(400, neckY + 18, bw * 1.35),
    chest: A(400, neckY + 92, bw * 1.25),
    body: A(400, torsoCy - torsoRy * 0.25, bw * 2.25),
  };

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800"><defs>${defs.join('')}</defs>${back.join('')}${body.join('')}${head.join('')}</svg>`;
  return { svg, anchors };
}
