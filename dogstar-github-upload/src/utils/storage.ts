/**
 * Minimal IndexedDB key/value store (no dependency). Everything stays in the
 * visitor's own browser: saved looks, the current draft and the uploaded photo.
 */
const DB_NAME = 'dogstar-pet-style';
const STORE = 'kv';
let dbPromise: Promise<IDBDatabase> | null = null;

function db(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') return reject(new Error('IndexedDB indisponível'));
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  dbPromise.catch(() => { dbPromise = null; });
  return dbPromise;
}

function tx<T>(mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest): Promise<T> {
  return db().then(
    (d) =>
      new Promise<T>((resolve, reject) => {
        const t = d.transaction(STORE, mode);
        const req = fn(t.objectStore(STORE));
        t.oncomplete = () => resolve(req.result as T);
        t.onerror = () => reject(t.error);
        t.onabort = () => reject(t.error);
      }),
  );
}

export const idbGet = <T>(key: string) => tx<T | undefined>('readonly', (s) => s.get(key));
export const idbSet = (key: string, value: unknown) => tx<void>('readwrite', (s) => s.put(value, key));
export const idbDel = (key: string) => tx<void>('readwrite', (s) => s.delete(key));
export const idbKeys = () => tx<IDBValidKey[]>('readonly', (s) => s.getAllKeys());
export const idbClear = () => tx<void>('readwrite', (s) => s.clear());

/** Remove every trace of the site from this browser. */
export async function clearAllLocalData() {
  try { await idbClear(); } catch { /* storage blocked: nothing to clear */ }
  try { localStorage.removeItem('dogstar:prefs'); } catch { /* ignore */ }
}
