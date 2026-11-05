import { describe, expect, it } from 'vitest';
import { clearAllLocalData, idbGet, idbKeys, idbSet } from '../../src/utils/storage';

describe('armazenamento local', () => {
  it('salva, lê e limpa tudo', async () => {
    await idbSet('look-1', { title: 'teste' });
    expect(await idbGet('look-1')).toEqual({ title: 'teste' });
    await clearAllLocalData();
    expect(await idbKeys()).toHaveLength(0);
  });
});
