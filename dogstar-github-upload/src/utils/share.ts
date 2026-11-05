export type ShareResult = 'shared' | 'cancelled' | 'unsupported';

/** Native share sheet with the image file when the browser supports it. */
export async function shareImage(blob: Blob, filename: string, text: string): Promise<ShareResult> {
  const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
  if (!nav.share) return 'unsupported';
  const file = new File([blob], filename, { type: blob.type || 'image/png' });
  const data: ShareData = { files: [file], text, title: 'DogStar Pet Style' };
  if (nav.canShare && !nav.canShare(data)) return 'unsupported';
  try {
    await nav.share(data);
    return 'shared';
  } catch (e) {
    return (e as DOMException)?.name === 'AbortError' ? 'cancelled' : 'unsupported';
  }
}

export async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
