/**
 * Prefixes a public file path with the deploy base, so the site works both at
 * the domain root (/images/…) and in a sub-folder such as GitHub Pages
 * (/nome-do-repositorio/images/…).
 */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const asset = (p: string) => (p.startsWith('/') && !p.startsWith(BASE + '/') ? BASE + p : p);
