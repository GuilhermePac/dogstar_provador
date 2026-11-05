import { describe, expect, it } from 'vitest';
import { lookMessage, whatsappLink } from '../../src/utils/whatsapp';

describe('WhatsApp', () => {
  it('sem número configurado, abre o seletor de contato', () => {
    expect(whatsappLink('oi', '')).toBe('https://wa.me/?text=oi');
  });
  it('com número, limpa a formatação', () => {
    expect(whatsappLink('oi', '+55 (41) 99999-0000')).toBe('https://wa.me/5541999990000?text=oi');
  });
  it('mensagem do look traz raça, tosa, roupa e acessórios', () => {
    const m = lookMessage({ petName: 'Paçoca', breed: 'Shih Tzu', model: 'Dourado', grooming: 'Tosa bebê', clothes: ['Moletom'], accessories: ['Laço Rosa', 'Óculos'] });
    expect(m).toContain('tosa para meu cachorro');
    expect(m).toContain('Pet: Paçoca');
    expect(m).toContain('Raça: Shih Tzu (Dourado)');
    expect(m).toContain('Acessórios: Laço Rosa, Óculos');
  });
});
