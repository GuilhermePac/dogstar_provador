// Small geometry helpers shared by the illustration generators.

export const r1 = (n) => Math.round(n * 10) / 10;

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashString(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const pt = (cx, cy, rx, ry, a) => [cx + rx * Math.cos(a), cy + ry * Math.sin(a)];
const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
const f = (p) => `${r1(p[0])} ${r1(p[1])}`;

/**
 * Closed organic outline around an ellipse.
 * style: smooth | soft | tuft | curly | wire
 */
export function blob(cx, cy, rx, ry, { style = 'smooth', amp = 0, n = 18, seed = 1, rot = 0 } = {}) {
  if (style === 'smooth' || amp <= 0) {
    return `M ${f([cx - rx, cy])} A ${r1(rx)} ${r1(ry)} 0 1 0 ${f([cx + rx, cy])} A ${r1(rx)} ${r1(ry)} 0 1 0 ${f([cx - rx, cy])} Z`;
  }
  const rnd = mulberry32(seed);
  if (style === 'curly') {
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = rot + (i / n) * Math.PI * 2;
      const j = 1 + (rnd() - 0.5) * 0.04;
      pts.push(pt(cx, cy, rx * j, ry * j, a));
    }
    let d = `M ${f(pts[0])}`;
    for (let i = 0; i < n; i++) {
      const a = pts[i];
      const b = pts[(i + 1) % n];
      const chord = Math.hypot(b[0] - a[0], b[1] - a[1]);
      const rr = chord * (0.56 + amp * 0.1 + rnd() * 0.08);
      d += ` A ${r1(rr)} ${r1(rr)} 0 0 1 ${f(b)}`;
    }
    return d + ' Z';
  }
  // tuft / soft / wire: alternate outer tips and inner valleys
  const tipAmp = style === 'soft' ? amp * 0.6 : amp;
  const pts = [];
  const count = n * 2;
  for (let i = 0; i < count; i++) {
    const a = rot + (i / count) * Math.PI * 2;
    const isTip = i % 2 === 0;
    const jitter = (rnd() - 0.5) * (style === 'wire' ? 0.5 : 0.35);
    const k = isTip ? 1 + tipAmp * (0.75 + jitter) : 1 - tipAmp * 0.25;
    pts.push(pt(cx, cy, rx * k, ry * k, a + (isTip ? jitter * 0.06 : 0)));
  }
  let d = `M ${f(mid(pts[count - 1], pts[0]))}`;
  for (let i = 0; i < count; i++) {
    const p = pts[i];
    const next = pts[(i + 1) % count];
    if (style === 'wire' && i % 2 === 0) {
      d += ` L ${f(p)} L ${f(mid(p, next))}`;
    } else {
      d += ` Q ${f(p)} ${f(mid(p, next))}`;
    }
  }
  return d + ' Z';
}

/** Polygon through points, smoothed with quadratic curves. */
export function smoothPoly(points) {
  const n = points.length;
  let d = `M ${f(mid(points[n - 1], points[0]))}`;
  for (let i = 0; i < n; i++) d += ` Q ${f(points[i])} ${f(mid(points[i], points[(i + 1) % n]))}`;
  return d + ' Z';
}

/** Fringe line from a to b with fur tips pointing to `dir` (+1 down). */
export function fringe(ax, bx, y, { tips = 8, depth = 26, seed = 3, curly = false } = {}) {
  const rnd = mulberry32(seed);
  const w = (bx - ax) / tips;
  let d = '';
  for (let i = 0; i < tips; i++) {
    const x0 = ax + i * w;
    const x1 = x0 + w;
    const dd = depth * (0.7 + rnd() * 0.6);
    if (curly) d += ` A ${r1(w * 0.55)} ${r1(w * 0.55)} 0 0 0 ${r1(x1)} ${r1(y)}`;
    else d += ` Q ${r1(x0 + w * 0.5)} ${r1(y + dd * 1.6)} ${r1(x1)} ${r1(y)}`;
  }
  return d;
}

export function shade(hex, amt) {
  const c = hex.replace('#', '');
  const num = parseInt(c.length === 3 ? c.split('').map((x) => x + x).join('') : c, 16);
  let r = (num >> 16) & 255;
  let g = (num >> 8) & 255;
  let b = num & 255;
  const t = amt < 0 ? 0 : 255;
  const p = Math.abs(amt);
  r = Math.round((t - r) * p + r);
  g = Math.round((t - g) * p + g);
  b = Math.round((t - b) * p + b);
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}
