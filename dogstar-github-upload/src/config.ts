/**
 * Configuração da DogStar. Edite aqui antes de publicar.
 */
export const CONFIG = {
  /**
   * WhatsApp da DogStar no formato internacional, só números.
   * Ex.: '5541999999999' (55 = Brasil, 41 = DDD).
   * Enquanto estiver vazio, os botões abrem o WhatsApp com a mensagem pronta
   * para o visitante escolher o contato.
   */
  whatsappNumber: '',
  /** Endereço público do site, usado no sitemap e nos links compartilhados. */
  siteUrl: '',
  businessName: 'DogStar Banho e Tosa',
  city: 'São José dos Pinhais — PR',
  /** Instagram (opcional), ex.: 'dogstar.petshop' */
  instagram: '',
} as const;

export const MESSAGES = {
  grooming: 'Olá! Estava experimentando estilos no provador virtual da DogStar e gostaria de saber mais sobre uma tosa para meu cachorro.',
  clothes: 'Olá! Vi uma roupinha no provador virtual da DogStar e gostaria de saber mais sobre ela.',
  accessories: 'Olá! Vi um acessório no provador virtual da DogStar e gostaria de saber mais sobre ele.',
  general: 'Olá! Estava usando o provador virtual da DogStar e gostaria de conversar com vocês.',
} as const;
