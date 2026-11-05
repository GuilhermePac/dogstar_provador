import type { Backdrop, Layer } from '../types';
import { loadImage } from '../utils/image';
import { asset } from '../utils/asset';
import { STAGE } from './placement';

export interface ComposeInput {
  base: string;
  layers: Layer[];
  backdrop: Backdrop | null; // null for photos (they fill the frame)
  label: string; // honest description of what the image is
  size?: number;
  withFooter?: boolean;
}

/** Paint the backdrop exactly like the on-screen stage. */
function paintBackdrop(ctx: CanvasRenderingContext2D, size: number, backdrop: Backdrop) {
  if (backdrop === 'white') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    return;
  }
  if (backdrop === 'paper') {
    const g = ctx.createRadialGradient(size / 2, size * 0.45, 0, size / 2, size * 0.45, size * 0.7);
    g.addColorStop(0, '#ffffff');
    g.addColorStop(1, '#f1f1f1');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    return;
  }
  // DogStar rays
  const cx = size / 2;
  const cy = size * 0.47;
  const steps = 360 / 30;
  for (let i = 0; i < steps; i++) {
    const a0 = ((-8 + i * 30 - 90) * Math.PI) / 180;
    const a1 = a0 + (14 * Math.PI) / 180;
    const a2 = a0 + (30 * Math.PI) / 180;
    ctx.fillStyle = 'rgba(255,121,0,0.95)';
    wedge(ctx, cx, cy, size * 1.5, a0, a1);
    ctx.fillStyle = 'rgba(255,121,0,0.78)';
    wedge(ctx, cx, cy, size * 1.5, a1, a2);
  }
}

function wedge(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, a0: number, a1: number) {
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.arc(cx, cy, r, a0, a1);
  ctx.closePath();
  ctx.fill();
}

export async function composeImage({ base, layers, backdrop, label, size = 1200, withFooter = true }: ComposeInput): Promise<Blob> {
  const footer = withFooter ? Math.round(size * 0.1) : 0;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size + footer;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingQuality = 'high';
  const k = size / STAGE;

  if (backdrop) paintBackdrop(ctx, size, backdrop);
  else {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
  }

  const [baseImg, ...layerImgs] = await Promise.all([loadImage(base), ...layers.map((l) => loadImage(l.src))]);
  ctx.drawImage(baseImg, 0, 0, size, size);

  layers.forEach((l, i) => {
    ctx.save();
    ctx.globalAlpha = l.opacity;
    ctx.translate(l.x * k, l.y * k);
    ctx.rotate((l.rotation * Math.PI) / 180);
    if (l.flipX) ctx.scale(-1, 1);
    ctx.drawImage(layerImgs[i], (-l.w / 2) * k, (-l.h / 2) * k, l.w * k, l.h * k);
    ctx.restore();
  });

  if (withFooter) {
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, size, size, footer);
    try {
      const logo = await loadImage(asset('/images/logo/dogstar-wordmark.png'));
      const lh = footer * 0.42;
      const lw = (logo.width / logo.height) * lh;
      // white plate so the black "DOG" stays readable on the dark band
      const pad = footer * 0.12;
      ctx.fillStyle = '#ffffff';
      roundRect(ctx, size * 0.04, size + (footer - lh) / 2 - pad, lw + pad * 2, lh + pad * 2, pad);
      ctx.fill();
      ctx.drawImage(logo, size * 0.04 + pad, size + (footer - lh) / 2, lw, lh);
    } catch {
      /* logo is decorative here */
    }
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.font = `600 ${Math.round(footer * 0.2)}px "Figtree Variable", system-ui, sans-serif`;
    ctx.fillText('Provador virtual DogStar', size * 0.96, size + footer * 0.4);
    ctx.fillStyle = '#bdbdbd';
    ctx.font = `500 ${Math.round(footer * 0.16)}px "Figtree Variable", system-ui, sans-serif`;
    ctx.fillText(label, size * 0.96, size + footer * 0.66);
  }

  return new Promise((resolve, reject) => canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Falha ao gerar a imagem'))), 'image/png'));
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
