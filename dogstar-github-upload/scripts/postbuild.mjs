// Runs after `vite build`: SPA fallbacks for static hosts, sitemap and robots.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const config = fs.readFileSync(path.join(root, 'src/config.ts'), 'utf8');
const siteUrl = (config.match(/siteUrl:\s*'([^']*)'/)?.[1] || '').replace(/\/$/, '');
const breeds = JSON.parse(fs.readFileSync(path.join(root, 'src/data/breeds.json'), 'utf8'));

// GitHub Pages and similar serve 404.html for unknown paths → SPA keeps working.
fs.copyFileSync(path.join(dist, 'index.html'), path.join(dist, '404.html'));

const routes = ['/', '/comecar', '/racas', '/tosas', '/roupas', '/acessorios', '/enviar-foto', '/provador', '/sobre', '/privacidade', ...breeds.map((b) => `/racas/${b.slug}`)];
const base = siteUrl || 'https://SEU-DOMINIO.com.br';
const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((r) => `  <url><loc>${base}${r}</loc><lastmod>${today}</lastmod></url>`).join('\n')}\n</urlset>\n`);
fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /provador/resultado\nDisallow: /meus-looks\n\nSitemap: ${base}/sitemap.xml\n`);
if (!siteUrl) console.warn('⚠  CONFIG.siteUrl está vazio: sitemap.xml e robots.txt usam https://SEU-DOMINIO.com.br. Preencha src/config.ts antes de publicar.');
console.log(`postbuild: 404.html, sitemap.xml (${routes.length} URLs), robots.txt`);
