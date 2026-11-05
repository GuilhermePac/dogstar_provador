import { describe, expect, it } from 'vitest';
import { checkImageFile, sniff, MAX_UPLOAD_BYTES } from '../../src/utils/image';

const file = (bytes: number[], name: string, type = '') => new File([new Uint8Array(bytes)], name, { type });

describe('validação de upload', () => {
  it('reconhece JPEG, PNG e WebP pela assinatura', () => {
    expect(sniff(new Uint8Array([0xff, 0xd8, 0xff, 0xe0]))).toBe('image/jpeg');
    expect(sniff(new Uint8Array([0x89, 0x50, 0x4e, 0x47]))).toBe('image/png');
    expect(sniff(new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]))).toBe('image/webp');
  });
  it('rejeita arquivo renomeado (.jpg que não é imagem)', async () => {
    const r = await checkImageFile(file([0x4d, 0x5a, 0x90, 0x00], 'virus.jpg', 'image/jpeg'));
    expect(r.ok).toBe(false);
  });
  it('rejeita SVG (pode conter script)', async () => {
    const r = await checkImageFile(new File(['<svg onload="alert(1)"/>'], 'x.svg', { type: 'image/svg+xml' }));
    expect(r.ok).toBe(false);
  });
  it('explica o caso HEIC do iPhone', async () => {
    const r = await checkImageFile(file([0, 0, 0, 0x18, 0x66, 0x74, 0x79, 0x70], 'IMG_0001.HEIC'));
    expect(r.ok === false && r.reason).toMatch(/HEIC/);
  });
  it('rejeita vazio e acima do limite', async () => {
    expect((await checkImageFile(file([], 'a.jpg'))).ok).toBe(false);
    const big = new File([new Uint8Array(MAX_UPLOAD_BYTES + 1)], 'big.jpg');
    expect((await checkImageFile(big)).ok).toBe(false);
  });
  it('aceita um JPEG válido', async () => {
    expect((await checkImageFile(file([0xff, 0xd8, 0xff, 0xe0, 0, 0x10], 'cao.jpg'))).ok).toBe(true);
  });
});
