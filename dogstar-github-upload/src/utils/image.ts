export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
export const MIN_SIDE = 320;
export const WORK_SIDE = 2048;

export type ImageCheck =
  | { ok: true; mime: 'image/jpeg' | 'image/png' | 'image/webp' }
  | { ok: false; reason: string };

/**
 * Validates by real file signature (magic bytes), not by extension or the
 * MIME type the browser guesses — a renamed .exe or .svg is rejected.
 */
export async function checkImageFile(file: File): Promise<ImageCheck> {
  if (file.size === 0) return { ok: false, reason: 'O arquivo está vazio. Escolha outra foto.' };
  if (file.size > MAX_UPLOAD_BYTES) return { ok: false, reason: 'A foto passa de 15 MB. Escolha uma imagem menor ou tire um print da foto.' };
  const head = new Uint8Array(await file.slice(0, 16).arrayBuffer());
  const mime = sniff(head);
  if (!mime) {
    const isHeic = /hei[cf]$/i.test(file.name) || /hei[cf]/i.test(file.type);
    return {
      ok: false,
      reason: isHeic
        ? 'Fotos HEIC do iPhone ainda não são aceitas aqui. No iPhone, ajuste Câmera › Formatos › Mais compatível, ou envie um print da foto.'
        : 'Esse arquivo não é uma foto JPG, PNG ou WebP. Escolha outra imagem.',
    };
  }
  return { ok: true, mime };
}

export function sniff(b: Uint8Array): 'image/jpeg' | 'image/png' | 'image/webp' | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg';
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png';
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 && b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50) return 'image/webp';
  return null;
}

/**
 * Decode (honouring EXIF orientation) and downscale to a working size.
 * Uses a Web Worker + OffscreenCanvas when available so big phone photos
 * don't freeze the page; falls back to the main thread otherwise.
 * Re-encoding also strips EXIF metadata such as GPS location.
 */
export async function prepareImage(file: Blob): Promise<{ blob: Blob; width: number; height: number }> {
  if (typeof Worker !== 'undefined' && typeof OffscreenCanvas !== 'undefined') {
    try {
      return await runWorker(file);
    } catch {
      /* fall through to main thread */
    }
  }
  const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
  try {
    const { w, h } = fitSize(bmp.width, bmp.height, WORK_SIDE);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bmp, 0, 0, w, h);
    const blob = await new Promise<Blob>((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error('encode'))), 'image/jpeg', 0.9));
    return { blob, width: w, height: h };
  } finally {
    bmp.close();
  }
}

function runWorker(file: Blob): Promise<{ blob: Blob; width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(new URL('../workers/resize.worker.ts', import.meta.url), { type: 'module' });
    const timer = setTimeout(() => { worker.terminate(); reject(new Error('timeout')); }, 20000);
    worker.onmessage = (e) => {
      clearTimeout(timer);
      worker.terminate();
      if (e.data.error) reject(new Error(e.data.error));
      else resolve(e.data);
    };
    worker.onerror = (e) => { clearTimeout(timer); worker.terminate(); reject(e); };
    worker.postMessage({ file, max: WORK_SIDE });
  });
}

export function fitSize(w: number, h: number, max: number) {
  const k = Math.min(1, max / Math.max(w, h));
  return { w: Math.round(w * k), h: Math.round(h * k) };
}

export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Não foi possível carregar ${src}`));
    img.src = src;
  });
}
