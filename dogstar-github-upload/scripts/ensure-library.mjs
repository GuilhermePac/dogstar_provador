// Gera a biblioteca de ilustrações se ela ainda não existir (ex.: repositório
// enviado sem public/images/dogs). Roda antes de `npm test` e `npm run build`.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const need = ['public/images/dogs', 'public/images/clothes', 'public/images/accessories', 'src/data/dog-models.json']
  .some((p) => !fs.existsSync(path.join(root, p)));
if (need) {
  console.log('Gerando ilustrações e dados…');
  execFileSync(process.execPath, [path.join(root, 'scripts/generate-library.mjs')], { stdio: 'inherit' });
}
