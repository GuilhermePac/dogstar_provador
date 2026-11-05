// Generates the illustration library and the JSON data files.
//   node scripts/generate-library.mjs
// Entries in src/data/*.json whose "source" is not "illustration" (e.g. real
// photos added by hand) are preserved when the script runs again.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { drawDog } from './art/dog.mjs';
import { CLOTHES, CLOTHES_FIT } from './art/clothes.mjs';
import { ACCESSORIES } from './art/accessories.mjs';
import { BREEDS } from './data/breeds.mjs';
import { GROOMING, isCompatible } from './data/grooming.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const pub = (...p) => path.join(root, 'public', ...p);
const dataDir = path.join(root, 'src', 'data');
fs.mkdirSync(dataDir, { recursive: true });

const write = (file, content) => {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
};
const readJson = (name) => {
  try { return JSON.parse(fs.readFileSync(path.join(dataDir, name), 'utf8')); } catch { return []; }
};
const sizeOf = (svg) => { const m = svg.match(/viewBox="0 0 (\d+) (\d+)"/); return { w: +m[1], h: +m[2] }; };
const keepManual = (name) => readJson(name).filter((e) => e.source && e.source !== 'illustration');
const saveJson = (name, data) => write(path.join(dataDir, name), JSON.stringify(data, null, 2) + '\n');

const COAT_LABEL = { short: 'Pelo curto', medium: 'Pelo médio', long: 'Pelo longo', double: 'Pelo duplo', curly: 'Pelo encaracolado', wire: 'Pelo duro' };
const SIZE_LABEL = { small: 'Pequeno porte', medium: 'Médio porte', large: 'Grande porte' };

let files = 0;
let bytes = 0;
const breedsOut = [];
const modelsOut = [];

fs.rmSync(pub('images', 'dogs'), { recursive: true, force: true });
for (const b of BREEDS) {
  const groomings = GROOMING.filter((g) => isCompatible(b, g)).map((g) => g.id);
  const modelIds = [];
  for (const m of b.models) {
    const id = `${b.slug}--${m.id}`;
    const images = {};
    const anchors = {};
    for (const g of groomings) {
      const { svg, anchors: a } = drawDog({ id, breed: b, colors: m.colors, grooming: g, tongue: m.tongue });
      const rel = `/images/dogs/${b.slug}/${m.id}/${g}.svg`;
      write(pub(rel), svg);
      files++; bytes += svg.length;
      images[g] = rel;
      anchors[g] = a;
    }
    const sw = [m.colors.base, m.colors.light, m.colors.tan, m.colors.dark].filter(Boolean);
    modelsOut.push({
      id, breed: b.slug, name: m.name,
      swatches: [...new Set(sw)].slice(0, 3),
      images, anchors, source: 'illustration',
    });
    modelIds.push(id);
  }
  breedsOut.push({
    slug: b.slug, name: b.name, size: b.size, sizeLabel: SIZE_LABEL[b.size],
    coat: b.coat, coatLabel: COAT_LABEL[b.coat], srd: !!b.srd,
    origin: b.origin, traits: b.traits, description: b.description,
    colors: b.models.map((m) => m.name), groomings, models: modelIds,
    cover: `/images/dogs/${b.slug}/${b.models[0].id}/natural.svg`,
    source: 'illustration',
  });
}

const groomOut = GROOMING.map((g) => {
  const [slug, model] = g.reference;
  return {
    id: g.id, name: g.name, short: g.short, description: g.description,
    coats: g.coats.map((c) => COAT_LABEL[c]),
    breeds: BREEDS.filter((b) => isCompatible(b, g)).map((b) => b.slug),
    reference: `/images/dogs/${slug}/${model}/${g.id}.svg`,
    referenceBefore: `/images/dogs/${slug}/${model}/natural.svg`,
    referenceModel: `${slug}--${model}`,
  };
});

fs.rmSync(pub('images', 'clothes'), { recursive: true, force: true });
const clothesOut = CLOTHES.map((c) => ({
  id: c.id, name: c.name, category: c.category, description: c.description, sizes: c.sizes,
  colors: c.colors.map((col) => {
    const rel = `/images/clothes/${c.id}-${col.id}.svg`;
    const svg = c.draw(col.hex);
    write(pub(rel), svg); files++; bytes += svg.length;
    return { ...col, image: rel, ...sizeOf(svg) };
  }),
  fit: CLOTHES_FIT, source: 'illustration',
}));

fs.rmSync(pub('images', 'accessories'), { recursive: true, force: true });
const accOut = ACCESSORIES.map((a) => {
  const rel = `/images/accessories/${a.id}.svg`;
  const svg = a.draw();
  write(pub(rel), svg); files++; bytes += svg.length;
  return { id: a.id, name: a.name, category: a.category, description: a.description, image: rel, ...sizeOf(svg), fit: a.fit, source: 'illustration' };
});

saveJson('breeds.json', [...breedsOut, ...keepManual('breeds.json')]);
saveJson('dog-models.json', [...modelsOut, ...keepManual('dog-models.json')]);
saveJson('grooming.json', groomOut);
saveJson('clothes.json', [...clothesOut, ...keepManual('clothes.json')]);
saveJson('accessories.json', [...accOut, ...keepManual('accessories.json')]);

console.log(`${BREEDS.length} raças · ${modelsOut.length} modelos · ${files} imagens · ${(bytes / 1024 / 1024).toFixed(2)} MB`);
