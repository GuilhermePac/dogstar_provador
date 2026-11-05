// Grooming styles. Compatibility is by coat type, plus explicit breed extras.
export const GROOMING = [
  {
    id: 'natural', name: 'Pelagem natural', short: 'Sem tosa',
    description: 'Como o pelo cresce naturalmente, só com banho e escovação. É o ponto de partida para comparar os estilos.',
    coats: ['short', 'medium', 'long', 'double', 'curly', 'wire'], breeds: [], reference: ['shih-tzu', 'branco-caramelo'],
  },
  {
    id: 'bebe', name: 'Tosa bebê', short: 'Bebê',
    description: 'Pelo do corpo, das patas e da cabeça na mesma medida, curtinho e macio, deixando o pet com cara de filhote.',
    coats: ['long', 'curly', 'wire'], breeds: ['cocker-spaniel'], reference: ['shih-tzu', 'branco-caramelo'],
  },
  {
    id: 'ursinho', name: 'Tosa ursinho (Teddy Bear)', short: 'Ursinho',
    description: 'Cabeça bem redonda e fofa, focinho volumoso e patas em formato de coluna — o visual de ursinho de pelúcia.',
    coats: ['long', 'curly'], breeds: ['spitz-alemao', 'chow-chow'], reference: ['bichon-frise', 'branco'],
  },
  {
    id: 'tesoura', name: 'Tosa na tesoura', short: 'Tesoura',
    description: 'Acabamento feito à mão, que modela o contorno respeitando o volume natural. Indicada também para pelagens duplas.',
    coats: ['long', 'curly', 'wire', 'medium', 'double'], breeds: [], reference: ['poodle-toy', 'abricot'],
  },
  {
    id: 'maquina', name: 'Tosa na máquina', short: 'Máquina',
    description: 'Pelo bem baixo e uniforme em todo o corpo. Prática para o dia a dia e para quem quer menos escovação.',
    coats: ['long', 'curly', 'wire'], breeds: ['cocker-spaniel'], reference: ['lhasa-apso', 'dourado'],
  },
  {
    id: 'higienica', name: 'Tosa higiênica', short: 'Higiênica',
    description: 'Limpeza das patinhas, da barriga e das regiões íntimas, mantendo o restante do pelo como está.',
    coats: ['short', 'medium', 'long', 'double', 'curly', 'wire'], breeds: [], reference: ['shih-tzu', 'branco-caramelo'],
  },
  {
    id: 'completa', name: 'Tosa completa (padrão)', short: 'Completa',
    description: 'Corpo mais curto e patas, cabeça e detalhes modelados. Nos terriers, preserva a barba e as sobrancelhas.',
    coats: ['long', 'curly', 'wire'], breeds: ['cocker-spaniel'], reference: ['schnauzer', 'sal-pimenta'],
  },
  {
    id: 'asiatica', name: 'Tosa asiática', short: 'Asiática',
    description: 'Inspirada nos salões japoneses e coreanos: cabeça redonda, orelhas longas preservadas e patas volumosas.',
    coats: ['long', 'curly'], breeds: [], reference: ['poodle-toy', 'branco'],
  },
  {
    id: 'verao', name: 'Tosa verão', short: 'Verão',
    description: 'Corpo bem curtinho para os dias quentes, com a cabeça um pouco mais cheia para não perder a fofura.',
    coats: ['long', 'curly'], breeds: ['cocker-spaniel'], reference: ['cocker-spaniel', 'dourado'],
  },
  {
    id: 'personalizada', name: 'Tosa personalizada', short: 'Personalizada',
    description: 'Combinação pensada para o seu pet. Aqui, um exemplo com coque no topo, orelhas longas e corpo médio.',
    coats: ['long', 'curly'], breeds: [], reference: ['maltes', 'branco'],
  },
];

export function isCompatible(breed, g) {
  return g.coats.includes(breed.coat) || g.breeds.includes(breed.slug);
}
