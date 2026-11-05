import breedsJson from './breeds.json';
import modelsJson from './dog-models.json';
import groomingJson from './grooming.json';
import clothesJson from './clothes.json';
import accessoriesJson from './accessories.json';
import { asset } from '../utils/asset';
import type { Accessory, Breed, Clothing, DogModel, GroomingStyle, WearableItem } from '../types';

export const BREEDS = (breedsJson as Breed[]).map((b) => ({ ...b, cover: asset(b.cover) }));
export const MODELS = (modelsJson as unknown as DogModel[]).map((m) => ({
  ...m,
  images: Object.fromEntries(Object.entries(m.images).map(([k, v]) => [k, asset(v)])),
}));
export const GROOMING = (groomingJson as GroomingStyle[]).map((g) => ({ ...g, reference: asset(g.reference), referenceBefore: asset(g.referenceBefore) }));
export const CLOTHES = (clothesJson as unknown as Clothing[]).map((c) => ({ ...c, colors: c.colors.map((col) => ({ ...col, image: asset(col.image) })) }));
export const ACCESSORIES = (accessoriesJson as unknown as Accessory[]).map((a) => ({ ...a, image: asset(a.image) }));

const breedMap = new Map(BREEDS.map((b) => [b.slug, b]));
const modelMap = new Map(MODELS.map((m) => [m.id, m]));
const groomMap = new Map(GROOMING.map((g) => [g.id, g]));

export const getBreed = (slug: string) => breedMap.get(slug);
export const getModel = (id: string) => modelMap.get(id);
export const getGrooming = (id: string) => groomMap.get(id);
export const modelsOf = (slug: string) => MODELS.filter((m) => m.breed === slug);

export const CLOTHES_CATEGORIES: Record<string, string> = {
  pijamas: 'Pijamas',
  camisetas: 'Camisetas',
  vestidos: 'Vestidos',
  moletons: 'Moletons',
  jaquetas: 'Jaquetas',
  fantasias: 'Fantasias',
  'roupas-de-inverno': 'Inverno',
  'roupas-de-verao': 'Verão',
  'roupas-tematicas': 'Temáticas',
};

export const ACCESSORY_CATEGORIES: Record<string, string> = {
  bandanas: 'Bandanas',
  lacos: 'Laços',
  gravatas: 'Gravatas',
  oculos: 'Óculos',
  chapeus: 'Chapéus',
  bones: 'Bonés',
  coleiras: 'Coleiras',
  peitorais: 'Peitorais',
  enfeites: 'Enfeites',
  'acessorios-de-cabelo': 'Cabelo',
};

export const BREED_FILTERS: { id: string; label: string; test: (b: Breed) => boolean }[] = [
  { id: 'todos', label: 'Todos', test: () => true },
  { id: 'pequeno', label: 'Pequeno porte', test: (b) => b.size === 'small' && !b.srd },
  { id: 'medio', label: 'Médio porte', test: (b) => b.size === 'medium' && !b.srd },
  { id: 'grande', label: 'Grande porte', test: (b) => b.size === 'large' && !b.srd },
  { id: 'pelo-curto', label: 'Pelo curto', test: (b) => b.coat === 'short' },
  { id: 'pelo-longo', label: 'Pelo longo', test: (b) => ['long', 'medium', 'double'].includes(b.coat) },
  { id: 'encaracolado', label: 'Encaracolado', test: (b) => b.coat === 'curly' },
  { id: 'srd', label: 'Sem raça definida', test: (b) => b.srd },
];

export function clothingItem(c: Clothing, colorId?: string): WearableItem {
  const col = c.colors.find((x) => x.id === colorId) ?? c.colors[0];
  return {
    key: `${c.id}:${col.id}`, itemId: c.id, kind: 'clothes', name: c.name,
    category: CLOTHES_CATEGORIES[c.category] ?? c.category, colorName: col.name,
    image: col.image, w: col.w, h: col.h, fit: c.fit,
  };
}

export function accessoryItem(a: Accessory): WearableItem {
  return {
    key: a.id, itemId: a.id, kind: 'accessory', name: a.name,
    category: ACCESSORY_CATEGORIES[a.category] ?? a.category,
    image: a.image, w: a.w, h: a.h, fit: a.fit,
  };
}

export function findWearable(key: string): WearableItem | undefined {
  const [id, color] = key.split(':');
  const c = CLOTHES.find((x) => x.id === id);
  if (c) return clothingItem(c, color);
  const a = ACCESSORIES.find((x) => x.id === id);
  return a ? accessoryItem(a) : undefined;
}

/** Grooming styles for a breed: compatible ones first (spec: prioritise). */
export function groomingsFor(slug?: string) {
  const b = slug ? getBreed(slug) : undefined;
  if (!b) return { compatible: GROOMING, other: [] as GroomingStyle[] };
  return {
    compatible: GROOMING.filter((g) => b.groomings.includes(g.id)),
    other: GROOMING.filter((g) => !b.groomings.includes(g.id)),
  };
}
