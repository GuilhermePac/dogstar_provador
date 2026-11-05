// Source of truth for the generated illustration library.
// size: small|medium|large · coat: short|medium|long|double|curly|wire
// ear: erect|bat|folded|semi|button|floppy|long|drop · muzzle: flat|short|medium|long
// tail: curl|plume|pom|thin|stub · markings: see scripts/art/dog.mjs

const W = '#f7f4ee'; // warm white
const BLACK = '#262321';

export const BREEDS = [
  // ---------------- pequeno porte
  {
    slug: 'shih-tzu', name: 'Shih Tzu', size: 'small', coat: 'long', ear: 'drop', muzzle: 'flat', tail: 'curl', markings: ['blaze', 'topknot'],
    origin: 'Tibete / China', traits: ['Dócil', 'Companheiro', 'Ótimo para apartamento'],
    description: 'Pequeno, afetuoso e de pelagem longa e sedosa. Pede escovação frequente e é um dos campeões de tosa no Brasil.',
    models: [
      { id: 'branco-caramelo', name: 'Branco e caramelo', colors: { base: '#c98a4b', light: W, hair: W, hairPatch: '#d9a46c', ears: '#c98a4b', muzzle: W, chest: W } },
      { id: 'branco-preto', name: 'Branco e preto', colors: { base: '#2f2b29', light: W, hair: W, hairPatch: '#3b3633', ears: '#2f2b29', muzzle: W, chest: W } },
      { id: 'dourado', name: 'Dourado', colors: { base: '#d9a441', light: '#f3dca6', hair: '#e4b55a', ears: '#c8902c', muzzle: '#f3dca6', chest: '#f0cf86', markings: [] } },
      { id: 'tricolor', name: 'Tricolor', colors: { base: '#4a3a30', light: W, hair: W, hairPatch: '#b9773f', ears: '#b9773f', muzzle: W, chest: W } },
    ],
  },
  {
    slug: 'yorkshire', name: 'Yorkshire Terrier', size: 'small', coat: 'long', ear: 'erect', muzzle: 'short', tail: 'plume', markings: ['topknot', 'noChest'],
    origin: 'Inglaterra', traits: ['Corajoso', 'Ativo', 'Pelagem fina'],
    description: 'Miniatura cheia de personalidade, com pelagem azul-aço e castanho dourado que cresce de forma contínua.',
    models: [
      { id: 'azul-dourado', name: 'Azul-aço e dourado', colors: { base: '#c7934e', light: '#e2b878', hair: '#5a6470', ears: '#c7934e', muzzle: '#d6a560', chest: '#c7934e', tail: '#5a6470' } },
      { id: 'preto-castanho', name: 'Preto e castanho (filhote)', colors: { base: '#b77b3e', light: '#d29b5c', hair: '#2e2a28', ears: '#b77b3e', muzzle: '#c88a49', chest: '#b77b3e', tail: '#2e2a28' } },
    ],
  },
  {
    slug: 'lhasa-apso', name: 'Lhasa Apso', size: 'small', coat: 'long', ear: 'drop', muzzle: 'short', tail: 'curl', markings: [],
    origin: 'Tibete', traits: ['Independente', 'Atento', 'Pelagem densa'],
    description: 'Antigo guardião dos mosteiros tibetanos. Pelagem pesada e reta, que fica linda tanto longa quanto em tosas curtas.',
    models: [
      { id: 'dourado', name: 'Dourado', colors: { base: '#d4a35b', light: '#ecd2a2', hair: '#d9ad68', ears: '#c38f45', muzzle: '#ecd2a2' } },
      { id: 'creme', name: 'Creme', colors: { base: '#eadbbf', light: '#f6eedf', hair: '#ecdfc6', ears: '#dcc59d', muzzle: '#f6eedf' } },
      { id: 'grisalho', name: 'Grisalho', colors: { base: '#8d8a86', light: '#d8d5d0', hair: '#a19e99', ears: '#6f6c68', muzzle: '#d8d5d0' } },
    ],
  },
  {
    slug: 'maltes', name: 'Maltês', size: 'small', coat: 'long', ear: 'drop', muzzle: 'short', tail: 'curl', markings: ['topknot'],
    origin: 'Mediterrâneo', traits: ['Carinhoso', 'Brincalhão', 'Branco puro'],
    description: 'Todo branco, leve e elegante. Pelagem longa e sem subpelo, muito usada com tosa bebê no dia a dia.',
    models: [
      { id: 'branco', name: 'Branco', colors: { base: '#fbfaf7', light: '#ffffff', hair: '#fbfaf7', ears: '#f4f1ea', muzzle: '#ffffff' } },
      { id: 'branco-marfim', name: 'Branco marfim', colors: { base: '#f3ead8', light: '#fbf6ec', hair: '#f3ead8', ears: '#ecdfc5', muzzle: '#fbf6ec' } },
    ],
  },
  {
    slug: 'poodle-toy', name: 'Poodle Toy', size: 'small', coat: 'curly', ear: 'drop', muzzle: 'long', tail: 'pom', markings: [],
    origin: 'França / Alemanha', traits: ['Inteligente', 'Não troca muito pelo', 'Versátil na tosa'],
    description: 'O menor dos poodles. Pelagem encaracolada que aceita praticamente todos os estilos de tosa.',
    models: [
      { id: 'branco', name: 'Branco', colors: { base: '#f4f1ea', light: '#ffffff' } },
      { id: 'abricot', name: 'Abricó', colors: { base: '#e6a66b', light: '#f3cfa4' } },
      { id: 'preto', name: 'Preto', colors: { base: '#2b2826', light: '#3e3a37', muzzle: '#2b2826' } },
      { id: 'chocolate', name: 'Chocolate', colors: { base: '#6b4430', light: '#8a5d44', muzzle: '#6b4430' } },
    ],
  },
  {
    slug: 'spitz-alemao', name: 'Spitz Alemão (Lulu da Pomerânia)', size: 'small', coat: 'double', ear: 'erect', muzzle: 'short', tail: 'curl', markings: ['ruffLight'], earSize: 0.6,
    origin: 'Alemanha', traits: ['Alegre', 'Vocal', 'Subpelo volumoso'],
    description: 'Uma bola de pelos com orelhinhas em pé. Tem subpelo denso: a tosa deve apenas modelar, nunca raspar.',
    models: [
      { id: 'laranja', name: 'Laranja', colors: { base: '#e58a32', light: '#f4c48a', chest: '#f0b06a' } },
      { id: 'creme', name: 'Creme', colors: { base: '#efd9ae', light: '#faf0dc', chest: '#f6e6c8' } },
      { id: 'branco', name: 'Branco', colors: { base: '#faf8f3', light: '#ffffff' } },
      { id: 'preto', name: 'Preto', colors: { base: '#272422', light: '#3a3633', chest: '#302c29', muzzle: '#2f2b28' } },
    ],
  },
  {
    slug: 'chihuahua', name: 'Chihuahua', size: 'small', coat: 'short', ear: 'bat', muzzle: 'short', tail: 'thin', markings: [], earSize: 1.1,
    origin: 'México', traits: ['Leal', 'Alerta', 'Menor raça do mundo'],
    description: 'O menor cão do mundo, com orelhas grandes e muita atitude. Pelagem curta, só precisa de banho e higiene.',
    models: [
      { id: 'fulvo', name: 'Fulvo', colors: { base: '#d7a46a', light: '#efd3ac' } },
      { id: 'preto-castanho', name: 'Preto e castanho', colors: { base: BLACK, tan: '#b8763a', light: '#c98a4b', chest: '#c98a4b', markings: ['tanBrows', 'tanMuzzle', 'tanPaws'] } },
      { id: 'creme', name: 'Creme', colors: { base: '#eedcbc', light: '#faf1e2' } },
    ],
  },
  {
    slug: 'pinscher', name: 'Pinscher Miniatura', size: 'small', coat: 'short', ear: 'erect', muzzle: 'medium', tail: 'thin', build: 'slim', markings: ['tanBrows', 'tanMuzzle', 'tanPaws', 'noChest'],
    origin: 'Alemanha', traits: ['Enérgico', 'Destemido', 'Pelo curtinho'],
    description: 'Pequeno, elegante e cheio de energia. Pelagem curta e brilhante que dispensa tosa.',
    models: [
      { id: 'preto-ferrugem', name: 'Preto e ferrugem', colors: { base: BLACK, tan: '#a85a2a' } },
      { id: 'vermelho', name: 'Vermelho', colors: { base: '#a2512b', tan: '#a2512b', markings: [] } },
    ],
  },
  {
    slug: 'pug', name: 'Pug', size: 'small', coat: 'short', ear: 'button', muzzle: 'flat', tail: 'curl', build: 'stocky', markings: ['darkMuzzle', 'wrinkles'],
    origin: 'China', traits: ['Bem-humorado', 'Companheiro', 'Braquicefálico'],
    description: 'Carinha amassada, olhos grandes e humor de sobra. Precisa de cuidado com as dobrinhas da face.',
    models: [
      { id: 'abricot', name: 'Abricó (fawn)', colors: { base: '#e3c89a', dark: '#2a2420', ears: '#2a2420' }, tongue: true },
      { id: 'preto', name: 'Preto', colors: { base: '#2a2725', dark: '#1d1b1a', ears: '#1d1b1a', light: '#2a2725' } },
    ],
  },
  {
    slug: 'bichon-frise', name: 'Bichon Frisé', size: 'small', coat: 'curly', ear: 'drop', muzzle: 'short', tail: 'pom', markings: [],
    origin: 'Mediterrâneo / França', traits: ['Alegre', 'Sociável', 'Pelagem de algodão'],
    description: 'Branquinho e fofo como algodão. A tosa arredondada da cabeça é a sua marca registrada.',
    models: [
      { id: 'branco', name: 'Branco', colors: { base: '#fbfaf6', light: '#ffffff' } },
      { id: 'creme', name: 'Branco com creme', colors: { base: '#f4ead6', light: '#fdf8ee' } },
    ],
  },
  {
    slug: 'dachshund', name: 'Dachshund (Salsicha)', size: 'small', coat: 'short', ear: 'long', muzzle: 'long', tail: 'thin', build: 'lowrider', markings: [],
    origin: 'Alemanha', traits: ['Curioso', 'Teimoso', 'Corpo alongado'],
    description: 'O famoso salsicha: pernas curtas, corpo longo e um faro excelente.',
    models: [
      { id: 'vermelho', name: 'Vermelho', colors: { base: '#a8562c', light: '#c0703f' } },
      { id: 'preto-castanho', name: 'Preto e castanho', colors: { base: BLACK, tan: '#a8582a', markings: ['tanBrows', 'tanMuzzle', 'tanPaws', 'noChest'] } },
      { id: 'arlequim', name: 'Arlequim', colors: { base: '#8f8a86', dark: '#2d2a28', light: '#b4afa9', markings: ['spots'] } },
    ],
  },
  {
    slug: 'pequines', name: 'Pequinês', size: 'small', coat: 'long', ear: 'drop', muzzle: 'flat', tail: 'curl', build: 'stocky', markings: ['darkMuzzle'],
    origin: 'China', traits: ['Digno', 'Independente', 'Juba farta'],
    description: 'Cão dos imperadores chineses, com juba volumosa e andar de leão.',
    models: [
      { id: 'dourado', name: 'Dourado com máscara', colors: { base: '#d39a55', dark: '#3b2e25', hair: '#dba566', ears: '#9a6a3d', muzzle: '#3b2e25' } },
      { id: 'creme', name: 'Creme', colors: { base: '#ecd8b0', dark: '#4a3a2e', hair: '#efdcb8', ears: '#d8bd8c', muzzle: '#4a3a2e' } },
    ],
  },
  {
    slug: 'westie', name: 'West Highland White Terrier', size: 'small', coat: 'wire', ear: 'erect', muzzle: 'short', tail: 'thin', markings: [], earSize: 0.7,
    origin: 'Escócia', traits: ['Animado', 'Confiante', 'Pelo duro branco'],
    description: 'O Westie: branquinho, de pelo duro e expressão marota. A cabeça arredondada é clássica na tosa.',
    models: [{ id: 'branco', name: 'Branco', colors: { base: '#faf8f2', light: '#ffffff', beard: '#ffffff' } }],
  },
  {
    slug: 'papillon', name: 'Papillon', size: 'small', coat: 'medium', ear: 'erect', muzzle: 'medium', tail: 'plume', markings: ['blaze'], earSize: 1.0,
    origin: 'França / Bélgica', traits: ['Esperto', 'Ágil', 'Orelhas de borboleta'],
    description: 'Nome em francês para borboleta, por causa das orelhas franjadas. Pelagem fina, sem subpelo.',
    models: [{ id: 'branco-vermelho', name: 'Branco e vermelho', colors: { base: '#b0602e', light: W, chest: W, muzzle: W, paws: W, tail: W } }],
  },
  {
    slug: 'jack-russell', name: 'Jack Russell Terrier', size: 'small', coat: 'short', ear: 'folded', muzzle: 'medium', tail: 'thin', markings: [],
    origin: 'Inglaterra', traits: ['Muito ativo', 'Caçador', 'Inteligente'],
    description: 'Pequeno atleta de energia infinita, branco com manchas castanhas.',
    models: [{ id: 'branco-castanho', name: 'Branco e castanho', colors: { base: W, dark: '#b0702f', ears: '#b0702f', light: W, markings: ['eyePatch'] } }],
  },
  // ---------------- médio porte
  {
    slug: 'cocker-spaniel', name: 'Cocker Spaniel Inglês', size: 'medium', coat: 'medium', ear: 'long', muzzle: 'medium', tail: 'stub', markings: [],
    origin: 'Inglaterra', traits: ['Carinhoso', 'Alegre', 'Orelhas franjadas'],
    description: 'Orelhas longas e franjadas e olhar doce. Pelagem sedosa que se beneficia de tosa regular.',
    models: [
      { id: 'dourado', name: 'Dourado', colors: { base: '#c98a42', light: '#e2b170' } },
      { id: 'preto', name: 'Preto', colors: { base: '#2a2725', light: '#3a3633', muzzle: '#2a2725' } },
      { id: 'chocolate', name: 'Chocolate', colors: { base: '#6d4632', light: '#86593f', muzzle: '#6d4632' } },
    ],
  },
  {
    slug: 'beagle', name: 'Beagle', size: 'medium', coat: 'short', ear: 'long', muzzle: 'medium', tail: 'thin', markings: ['blaze', 'lowerFace', 'tailTip'],
    origin: 'Inglaterra', traits: ['Farejador', 'Amigável', 'Tricolor'],
    description: 'Cão farejador de temperamento doce, com o clássico tricolor e ponta da cauda branca.',
    models: [
      { id: 'tricolor', name: 'Tricolor', colors: { base: '#b9773b', light: W, chest: W, paws: W, ears: '#9a5f2c', markings: ['blaze', 'lowerFace', 'tailTip', 'saddle'] } },
      { id: 'limao', name: 'Limão e branco', colors: { base: '#e0bb7d', light: W, chest: W, paws: W, ears: '#d4a865' } },
    ],
  },
  {
    slug: 'schnauzer', name: 'Schnauzer', size: 'medium', coat: 'wire', ear: 'folded', muzzle: 'long', tail: 'thin', markings: [],
    origin: 'Alemanha', traits: ['Vigilante', 'Esperto', 'Barba e sobrancelhas'],
    description: 'Inconfundível pela barba e sobrancelhas. A tosa padrão realça o focinho e mantém o corpo curto.',
    models: [
      { id: 'sal-pimenta', name: 'Sal e pimenta', colors: { base: '#7d7f82', light: '#d9d9d6', beard: '#e2e2df', chest: '#9a9c9f' } },
      { id: 'preto', name: 'Preto', colors: { base: '#262422', light: '#3a3734', beard: '#3c3936', chest: '#2f2d2b' } },
      { id: 'preto-prata', name: 'Preto e prata', colors: { base: '#262422', light: '#c9c9c6', beard: '#d6d6d3', chest: '#c9c9c6' } },
    ],
  },
  {
    slug: 'bulldog-frances', name: 'Bulldog Francês', size: 'medium', coat: 'short', ear: 'bat', muzzle: 'flat', tail: 'stub', build: 'stocky', markings: ['wrinkles'], earSize: 0.9,
    origin: 'França', traits: ['Brincalhão', 'Calmo', 'Orelhas de morcego'],
    description: 'Orelhas de morcego, corpo compacto e muita simpatia. Pelagem curta e fácil de cuidar.',
    models: [
      { id: 'fulvo', name: 'Fulvo', colors: { base: '#d8b07a', light: '#ead0a8', ears: '#d8b07a' } },
      { id: 'tigrado', name: 'Tigrado', colors: { base: '#4a3a30', light: W, chest: W, markings: [] } },
      { id: 'creme', name: 'Creme', colors: { base: '#efe2c9', light: '#f8f1e3' } },
    ],
  },
  {
    slug: 'border-collie', name: 'Border Collie', size: 'medium', coat: 'medium', ear: 'semi', muzzle: 'long', tail: 'plume', markings: ['blaze', 'socks', 'ruffLight', 'tailTip'],
    origin: 'Reino Unido', traits: ['Muito inteligente', 'Pastor', 'Precisa de atividade'],
    description: 'Considerado o cão mais inteligente do mundo. Pelagem dupla média, com tosa apenas de acabamento.',
    models: [
      { id: 'preto-branco', name: 'Preto e branco', colors: { base: BLACK, light: W, chest: W, paws: W, muzzle: W } },
      { id: 'vermelho-branco', name: 'Vermelho e branco', colors: { base: '#8a4b2c', light: W, chest: W, paws: W, muzzle: W } },
      { id: 'blue-merle', name: 'Blue merle', colors: { base: '#8e9399', dark: '#3a3d42', light: W, chest: W, paws: W, muzzle: W, markings: ['spots', 'blaze', 'socks', 'ruffLight', 'tailTip'] } },
    ],
  },
  {
    slug: 'corgi', name: 'Welsh Corgi Pembroke', size: 'medium', coat: 'double', ear: 'erect', muzzle: 'medium', tail: 'stub', build: 'lowrider', markings: ['lowerFace', 'blaze', 'ruffLight'], earSize: 1.0,
    origin: 'País de Gales', traits: ['Esperto', 'Animado', 'Patas curtas'],
    description: 'Patinhas curtas, orelhas grandes e um bumbum famoso. Troca bastante pelo.',
    models: [
      { id: 'vermelho-branco', name: 'Vermelho e branco', colors: { base: '#d4813b', light: W, chest: W, paws: W, muzzle: W } },
      { id: 'tricolor', name: 'Tricolor', colors: { base: BLACK, light: W, chest: W, paws: W, muzzle: W, tan: '#c47a35', markings: ['tanBrows', 'lowerFace', 'blaze', 'ruffLight'] } },
    ],
  },
  {
    slug: 'boston-terrier', name: 'Boston Terrier', size: 'medium', coat: 'short', ear: 'bat', muzzle: 'flat', tail: 'stub', markings: ['blaze'], earSize: 0.8,
    origin: 'Estados Unidos', traits: ['Educado', 'Animado', 'Smoking natural'],
    description: 'O "cavalheiro americano", com pelagem que parece um smoking preto e branco.',
    models: [{ id: 'preto-branco', name: 'Preto e branco', colors: { base: BLACK, light: W, chest: W, muzzle: W, paws: W, markings: ['blaze', 'socks'] } }],
  },
  {
    slug: 'fox-paulistinha', name: 'Fox Paulistinha (Terrier Brasileiro)', size: 'medium', coat: 'short', ear: 'folded', muzzle: 'medium', tail: 'stub', build: 'slim', markings: [],
    origin: 'Brasil', traits: ['Raça brasileira', 'Ágil', 'Tricolor'],
    description: 'Raça brasileira reconhecida internacionalmente: tricolor, ágil e muito esperto.',
    models: [{ id: 'tricolor', name: 'Tricolor', colors: { base: W, dark: BLACK, ears: '#2d2a28', light: W, tan: '#c47a35', markings: ['eyePatch', 'tanBrows'] } }],
  },
  {
    slug: 'shiba-inu', name: 'Shiba Inu', size: 'medium', coat: 'double', ear: 'erect', muzzle: 'medium', tail: 'curl', markings: ['lowerFace', 'ruffLight'], earSize: 0.75,
    origin: 'Japão', traits: ['Independente', 'Limpo', 'Cara de raposa'],
    description: 'Raça japonesa de expressão de raposa e cauda enrolada. Pelagem dupla: tosa só de acabamento.',
    models: [
      { id: 'vermelho', name: 'Vermelho', colors: { base: '#d7843f', light: '#fbf1e2', chest: '#fbf1e2', paws: '#fbf1e2' } },
      { id: 'preto-castanho', name: 'Preto e castanho', colors: { base: '#2c2826', light: '#f6ead6', chest: '#f6ead6', paws: '#f6ead6', tan: '#c98a4b', markings: ['tanBrows', 'lowerFace', 'ruffLight'] } },
    ],
  },
  {
    slug: 'poodle-medio', name: 'Poodle Médio', size: 'medium', coat: 'curly', ear: 'drop', muzzle: 'long', tail: 'pom', markings: [],
    origin: 'França / Alemanha', traits: ['Inteligente', 'Atlético', 'Versátil na tosa'],
    description: 'Tamanho intermediário entre o toy e o standard, com a mesma pelagem encaracolada versátil.',
    models: [
      { id: 'cinza', name: 'Cinza', colors: { base: '#9b9c9e', light: '#b9babc' } },
      { id: 'creme', name: 'Creme', colors: { base: '#ecd9b6', light: '#f6ecda' } },
    ],
  },
  // ---------------- grande porte
  {
    slug: 'golden-retriever', name: 'Golden Retriever', size: 'large', coat: 'medium', ear: 'floppy', muzzle: 'medium', tail: 'plume', markings: [],
    origin: 'Escócia', traits: ['Gentil', 'Família', 'Pelagem dourada'],
    description: 'Gentil e amoroso, com pelagem dourada franjada. Tosa só de acabamento: o subpelo protege do calor.',
    models: [
      { id: 'dourado', name: 'Dourado', colors: { base: '#dca154', light: '#f0cf95' }, tongue: true },
      { id: 'creme', name: 'Creme claro', colors: { base: '#ecd3a0', light: '#f7e8c8' } },
      { id: 'dourado-escuro', name: 'Dourado escuro', colors: { base: '#b9762f', light: '#d69a55' } },
    ],
  },
  {
    slug: 'labrador', name: 'Labrador Retriever', size: 'large', coat: 'short', ear: 'floppy', muzzle: 'medium', tail: 'thin', markings: [],
    origin: 'Canadá', traits: ['Brincalhão', 'Família', 'Adora água'],
    description: 'Um dos cães mais populares do mundo: brincalhão, dócil e apaixonado por água.',
    models: [
      { id: 'amarelo', name: 'Amarelo', colors: { base: '#e7c27b', light: '#f0d7a3' }, tongue: true },
      { id: 'preto', name: 'Preto', colors: { base: '#252321', light: '#2e2b29', muzzle: '#2e2b29' } },
      { id: 'chocolate', name: 'Chocolate', colors: { base: '#5e3b28', light: '#6f4731', muzzle: '#6f4731' } },
    ],
  },
  {
    slug: 'pastor-alemao', name: 'Pastor Alemão', size: 'large', coat: 'double', ear: 'erect', muzzle: 'long', tail: 'plume', markings: ['darkMuzzle', 'saddle'], earSize: 1.05,
    origin: 'Alemanha', traits: ['Leal', 'Protetor', 'Treinável'],
    description: 'Leal, corajoso e muito treinável. Pelagem dupla que troca bastante; dispensa tosa.',
    models: [
      { id: 'preto-castanho', name: 'Preto e castanho', colors: { base: '#c08445', dark: '#2a2522', chest: '#d39a5c', light: '#d8a46a' } },
      { id: 'preto', name: 'Preto', colors: { base: '#2b2826', dark: '#1f1d1c', chest: '#2f2c2a', light: '#33302d', markings: [] } },
    ],
  },
  {
    slug: 'husky-siberiano', name: 'Husky Siberiano', size: 'large', coat: 'double', ear: 'erect', muzzle: 'medium', tail: 'plume', markings: ['lowerFace', 'cap', 'blaze', 'ruffLight'], earSize: 0.85,
    origin: 'Sibéria (Rússia)', traits: ['Resistente', 'Sociável', 'Olhar marcante'],
    description: 'Feito para o frio, com máscara facial marcante. Nunca deve ser raspado: o subpelo regula a temperatura.',
    models: [
      { id: 'cinza-branco', name: 'Cinza e branco', colors: { base: '#6f7378', light: '#f7f7f5', dark: '#3d4045', chest: '#f7f7f5', paws: '#f7f7f5' } },
      { id: 'preto-branco', name: 'Preto e branco', colors: { base: '#2d2c2b', light: '#f7f7f5', dark: '#1e1d1c', chest: '#f7f7f5', paws: '#f7f7f5' } },
      { id: 'vermelho-branco', name: 'Cobre e branco', colors: { base: '#b5683a', light: '#fbf4ea', dark: '#8a4a26', chest: '#fbf4ea', paws: '#fbf4ea' } },
    ],
  },
  {
    slug: 'chow-chow', name: 'Chow Chow', size: 'large', coat: 'double', ear: 'erect', muzzle: 'short', tail: 'curl', build: 'stocky', markings: [], earSize: 0.45,
    origin: 'China', traits: ['Reservado', 'Independente', 'Língua azul'],
    description: 'Juba de leão, língua azulada e jeito independente. A tosa ursinho valoriza seu formato redondo.',
    models: [
      { id: 'vermelho', name: 'Vermelho', colors: { base: '#c5703a', light: '#d98c52', chest: '#d98c52' } },
      { id: 'creme', name: 'Creme', colors: { base: '#efdcb6', light: '#f8ecd4', chest: '#f8ecd4' } },
      { id: 'preto', name: 'Preto', colors: { base: '#272423', light: '#33302e', chest: '#2f2c2a' } },
    ],
  },
  {
    slug: 'samoieda', name: 'Samoieda', size: 'large', coat: 'double', ear: 'erect', muzzle: 'medium', tail: 'curl', markings: [], earSize: 0.65,
    origin: 'Sibéria (Rússia)', traits: ['Sorridente', 'Sociável', 'Branco volumoso'],
    description: 'O famoso "sorriso samoieda" e uma pelagem branca e farta, que só deve ser modelada.',
    models: [{ id: 'branco', name: 'Branco', colors: { base: '#fbfaf6', light: '#ffffff' }, tongue: true }],
  },
  {
    slug: 'akita', name: 'Akita', size: 'large', coat: 'double', ear: 'erect', muzzle: 'medium', tail: 'curl', build: 'stocky', markings: ['lowerFace', 'ruffLight'], earSize: 0.7,
    origin: 'Japão', traits: ['Leal', 'Corajoso', 'Reservado'],
    description: 'Grande, digno e extremamente leal. Pelagem dupla densa, sem necessidade de tosa.',
    models: [
      { id: 'vermelho', name: 'Vermelho', colors: { base: '#c9773d', light: '#fbf1e2', chest: '#fbf1e2', paws: '#fbf1e2' } },
      { id: 'branco', name: 'Branco', colors: { base: '#f8f5ee', light: '#ffffff', markings: [] } },
    ],
  },
  {
    slug: 'sao-bernardo', name: 'São Bernardo', size: 'large', coat: 'medium', ear: 'floppy', muzzle: 'short', tail: 'plume', build: 'stocky', markings: ['blaze', 'lowerFace', 'socks'],
    origin: 'Suíça / Itália', traits: ['Gigante gentil', 'Calmo', 'Família'],
    description: 'Gigante gentil dos Alpes, famoso pelos resgates na neve. Calmo e ótimo com crianças.',
    models: [{ id: 'vermelho-branco', name: 'Vermelho e branco', colors: { base: '#b45f2c', light: W, chest: W, paws: W, muzzle: W, dark: '#5a2f17' } }],
  },
  {
    slug: 'bernese', name: 'Bernese Mountain Dog', size: 'large', coat: 'medium', ear: 'floppy', muzzle: 'medium', tail: 'plume', markings: ['blaze', 'tanBrows', 'socks'],
    origin: 'Suíça', traits: ['Calmo', 'Afetuoso', 'Tricolor'],
    description: 'Boieiro suíço tricolor, calmo e afetuoso, com pelagem longa e brilhante.',
    models: [{ id: 'tricolor', name: 'Tricolor', colors: { base: '#252221', light: W, chest: W, paws: W, muzzle: W, tan: '#b25e2b' } }],
  },
  {
    slug: 'pastor-australiano', name: 'Pastor Australiano', size: 'large', coat: 'medium', ear: 'semi', muzzle: 'medium', tail: 'stub', markings: ['blaze', 'ruffLight', 'socks'],
    origin: 'Estados Unidos', traits: ['Ativo', 'Inteligente', 'Pastor'],
    description: 'Apesar do nome, foi desenvolvido nos EUA. Muito ativo, de pelagem média e cores merle.',
    models: [
      { id: 'blue-merle', name: 'Blue merle', colors: { base: '#8e949b', dark: '#2f3237', light: W, chest: W, paws: W, muzzle: W, markings: ['spots', 'blaze', 'ruffLight', 'socks'] } },
      { id: 'red-merle', name: 'Red merle', colors: { base: '#c08a6a', dark: '#7a3f22', light: W, chest: W, paws: W, muzzle: W, markings: ['spots', 'blaze', 'ruffLight', 'socks'] } },
    ],
  },
  {
    slug: 'rottweiler', name: 'Rottweiler', size: 'large', coat: 'short', ear: 'floppy', muzzle: 'medium', tail: 'stub', build: 'stocky', markings: ['tanBrows', 'tanMuzzle', 'tanPaws', 'noChest'],
    origin: 'Alemanha', traits: ['Protetor', 'Confiante', 'Forte'],
    description: 'Forte e confiante, com marcações castanhas sobre o preto. Pelagem curta, sem tosa.',
    models: [{ id: 'preto-castanho', name: 'Preto e castanho', colors: { base: '#1f1c1a', tan: '#a8582a', ears: '#1f1c1a' } }],
  },
  {
    slug: 'doberman', name: 'Dobermann', size: 'large', coat: 'short', ear: 'floppy', muzzle: 'long', tail: 'thin', build: 'slim', markings: ['tanBrows', 'tanMuzzle', 'tanPaws', 'noChest'],
    origin: 'Alemanha', traits: ['Elegante', 'Alerta', 'Atlético'],
    description: 'Atlético e elegante. No Brasil o corte de orelhas e cauda é proibido — aqui ele aparece natural.',
    models: [
      { id: 'preto-ferrugem', name: 'Preto e ferrugem', colors: { base: '#201d1b', tan: '#a3542a' } },
      { id: 'marrom', name: 'Marrom e ferrugem', colors: { base: '#5a3426', tan: '#b06a3a' } },
    ],
  },
  {
    slug: 'dalmata', name: 'Dálmata', size: 'large', coat: 'short', ear: 'floppy', muzzle: 'medium', tail: 'thin', build: 'slim', markings: ['spots', 'noChest'],
    origin: 'Croácia', traits: ['Energético', 'Atlético', 'Pintado'],
    description: 'Branco com pintas pretas ou fígado, muito ativo e atlético.',
    models: [
      { id: 'preto', name: 'Pintas pretas', colors: { base: W, dark: '#222', ears: '#2a2725' } },
      { id: 'figado', name: 'Pintas fígado', colors: { base: W, dark: '#6b3a24', ears: '#6b3a24' } },
    ],
  },
  {
    slug: 'poodle-standard', name: 'Poodle Standard', size: 'large', coat: 'curly', ear: 'drop', muzzle: 'long', tail: 'pom', markings: [],
    origin: 'França / Alemanha', traits: ['Elegante', 'Muito inteligente', 'Atlético'],
    description: 'O maior dos poodles: elegante, atlético e com pelagem encaracolada que aceita qualquer estilo.',
    models: [
      { id: 'preto', name: 'Preto', colors: { base: '#2b2826', light: '#3e3a37', muzzle: '#2b2826' } },
      { id: 'branco', name: 'Branco', colors: { base: '#f6f3ec', light: '#ffffff' } },
    ],
  },
  {
    slug: 'galgo', name: 'Galgo (Greyhound)', size: 'large', coat: 'short', ear: 'folded', muzzle: 'long', tail: 'thin', build: 'slim', markings: [],
    origin: 'Reino Unido', traits: ['Velocista', 'Calmo em casa', 'Pelo curtíssimo'],
    description: 'O velocista dos cães: esguio, calmo dentro de casa e de pelagem curtíssima.',
    models: [
      { id: 'cinza', name: 'Cinza azulado', colors: { base: '#8a8f96', light: '#a9adb2' } },
      { id: 'tigrado', name: 'Tigrado', colors: { base: '#6e4a33', light: '#8a6248', chest: W, markings: [] } },
    ],
  },
  // ---------------- SRD
  {
    slug: 'srd-pequeno', name: 'SRD Pequeno (Vira-lata)', size: 'small', coat: 'short', ear: 'folded', muzzle: 'medium', tail: 'thin', markings: [], srd: true,
    origin: 'Brasil', traits: ['Único', 'Adaptável', 'Coração enorme'],
    description: 'Cada SRD é único. Este modelo de porte pequeno e pelo curto representa os caramelos e mesclados que alegram tantas casas.',
    models: [
      { id: 'caramelo', name: 'Caramelo', colors: { base: '#c98a4b', light: '#e7c08f' } },
      { id: 'preto-branco', name: 'Preto com peito branco', colors: { base: '#2a2725', light: W, chest: W, paws: W } },
    ],
  },
  {
    slug: 'srd-peludo', name: 'SRD Peludinho (Vira-lata)', size: 'small', coat: 'long', ear: 'drop', muzzle: 'short', tail: 'plume', markings: [], srd: true,
    origin: 'Brasil', traits: ['Único', 'Fofo', 'Pelagem longa'],
    description: 'Vira-lata de pelagem longa — candidato perfeito a uma tosa bebê ou ursinho.',
    models: [
      { id: 'mesclado', name: 'Mesclado', colors: { base: '#8a7a6c', light: '#d8cbbb', hair: '#9a8a7b', muzzle: '#d8cbbb' } },
      { id: 'branco', name: 'Branquinho', colors: { base: '#f3eee4', light: '#fbf8f2', hair: '#f3eee4', muzzle: '#fbf8f2' } },
    ],
  },
  {
    slug: 'srd-medio', name: 'SRD Médio (Vira-lata Caramelo)', size: 'medium', coat: 'short', ear: 'semi', muzzle: 'medium', tail: 'thin', markings: [], srd: true,
    origin: 'Brasil', traits: ['Símbolo nacional', 'Esperto', 'Resistente'],
    description: 'O famoso caramelo brasileiro: esperto, resistente e cheio de carisma.',
    models: [
      { id: 'caramelo', name: 'Caramelo', colors: { base: '#c98a4b', light: '#ecc796' }, tongue: true },
      { id: 'tigrado', name: 'Tigrado', colors: { base: '#5c4433', light: '#8b6b52', chest: '#e9dcc8' } },
    ],
  },
  {
    slug: 'srd-grande', name: 'SRD Grande (Vira-lata)', size: 'large', coat: 'medium', ear: 'floppy', muzzle: 'medium', tail: 'plume', markings: [], srd: true,
    origin: 'Brasil', traits: ['Grandão', 'Protetor', 'Companheiro'],
    description: 'Vira-lata de porte grande e pelagem média, companheiro para todas as horas.',
    models: [
      { id: 'preto', name: 'Preto', colors: { base: '#272422', light: '#363230', muzzle: '#33302d' } },
      { id: 'bege', name: 'Bege', colors: { base: '#d9bb8c', light: '#ecd9b8' } },
    ],
  },
];
