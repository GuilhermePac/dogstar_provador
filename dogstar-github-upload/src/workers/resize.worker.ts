/// <reference lib="webworker" />
// Decodes and downsizes an uploaded photo off the main thread.
self.onmessage = async (e: MessageEvent<{ file: Blob; max: number }>) => {
  try {
    const { file, max } = e.data;
    const bmp = await createImageBitmap(file, { imageOrientation: 'from-image' });
    const k = Math.min(1, max / Math.max(bmp.width, bmp.height));
    const w = Math.round(bmp.width * k);
    const h = Math.round(bmp.height * k);
    const canvas = new OffscreenCanvas(w, h);
    const ctx = canvas.getContext('2d')!;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(bmp, 0, 0, w, h);
    bmp.close();
    const blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.9 });
    (self as unknown as Worker).postMessage({ blob, width: w, height: h });
  } catch (err) {
    (self as unknown as Worker).postMessage({ error: String(err) });
  }
};
