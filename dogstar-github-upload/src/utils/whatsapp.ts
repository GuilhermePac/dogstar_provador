import { CONFIG, MESSAGES } from '../config';

export function whatsappLink(text: string, number: string = CONFIG.whatsappNumber) {
  const digits = number.replace(/\D/g, '');
  const q = `text=${encodeURIComponent(text)}`;
  // With a number: opens the DogStar chat. Without: WhatsApp asks who to send to.
  return digits ? `https://wa.me/${digits}?${q}` : `https://wa.me/?${q}`;
}

export const hasBusinessNumber = () => CONFIG.whatsappNumber.replace(/\D/g, '').length >= 10;

export interface LookSummary {
  petName?: string;
  breed?: string;
  model?: string;
  grooming?: string;
  groomingIsReference?: boolean;
  clothes: string[];
  accessories: string[];
}

export function lookMessage(s: LookSummary): string {
  const lines: string[] = [s.grooming && s.grooming !== 'Pelagem natural' ? MESSAGES.grooming : MESSAGES.general, ''];
  if (s.petName) lines.push(`Pet: ${s.petName}`);
  if (s.breed) lines.push(`Raça: ${s.breed}${s.model ? ` (${s.model})` : ''}`);
  if (s.grooming) lines.push(`Tosa: ${s.grooming}${s.groomingIsReference ? ' (vi a referência)' : ''}`);
  if (s.clothes.length) lines.push(`Roupa: ${s.clothes.join(', ')}`);
  if (s.accessories.length) lines.push(`Acessórios: ${s.accessories.join(', ')}`);
  return lines.join('\n').trim();
}
